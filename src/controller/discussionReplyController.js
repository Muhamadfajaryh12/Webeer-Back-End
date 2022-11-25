const { ObjectId } = require('mongodb');
const Discussion = require('../models/discussion.js');
const DiscussionReply = require('../models/discussionReply.js');
const User = require('../models/user.js');

const createReply = async(req,res) =>{
    const user = req.user;
    const { id } = req.params;
    const replyID = new ObjectId();

    const {
        reply,
    } = req.body

    const nameuser = await User.findOne({
        _id: user
    })

    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;
    
    const discussion = await Discussion.findOne({
        _id: id
    });
    
    const newReply = new DiscussionReply({
        _id: replyID,
        username: nameuser.username,
        userid: nameuser._id,
        userimage: nameuser.image,
        date,
        reply,
        discussionId: id
    });
    
    const userReply = await newReply.save();
    
    discussion.reply.push(replyID);
    await discussion.save();
    
    res.status(201).json({
        success: true,
        data: userReply,
      });
}

const getDiscussionReply = async(req, res) => {
    const { id } = req.params;

    const discussionReply = await DiscussionReply.find({
        discussionId: id
    });

    const userReply = await DiscussionReply.find({
        userid: id
    });

    if (discussionReply.length !== 0) {
        res.json({
            success: true,
            data: discussionReply,
        });
    } else if (userReply.length !== 0) {
        res.json({
            success: true,
            data: userReply,
        });
    } else {
        res.json({
            success: false,
            message: 'Error! Data not found'
        })
    }
}

const deleteReply = async(req, res) => {
    const user = req.user;
    const { id } = req.params;

    const replyId = await DiscussionReply.findOne({
        _id: id
    })

    if (user._id !== replyId.userid) {
        res.status(400).json({
            success: false,
            message: 'Tidak dapat menghapus balasan ini'
        })
        return
    }

    const reply = await DiscussionReply.findOneAndDelete({
        _id: id
    });

    const discussion = await Discussion.findOne({
        reply: id
    });

    const index = discussion.reply.findIndex((replyId) => replyId.toString() === id);

    if (index !== -1) {
        discussion.reply.splice(index, 1);
    }

    await discussion.save();
    
    if(reply) {
        res.send({
            success: true,
            message: 'Delete Successfully'
        })
    }
}
module.exports = {
    createReply,
    getDiscussionReply,
    getUserDicussionReply,
    deleteReply
}