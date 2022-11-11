const { ObjectId } = require('mongodb');
const Discussion = require('../models/discussion.js');
const DiscussionReply = require('../models/discussionReply.js');

const createReply = async(req,res) =>{
    const { id } = req.params;
    const replyID = new ObjectId();

    const {
        user_name_reply,
        reply,
    } = req.body

    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;
    
    const discussion = await Discussion.findOne({
        _id: id
    });
    
    const newReply = new DiscussionReply({
        _id: replyID,
        user_name_reply,
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

    const userReply = await DiscussionReply.find({
        discussionId: id
    });

    res.json({
        success: true,
        data: userReply,
      });
}

const deleteReply = async(req, res) => {
    const { id } = req.params;

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
    deleteReply
}