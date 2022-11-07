const DiscussionReply = require('../models/discussionReply.js');

const createReply = async(req,res) =>{
    const discussion = req.discussions;
    const {
        user_name_reply,
        reply,
    } = req.body

    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;

    const newReply = new DiscussionReply({
        user_name_reply,
        date,
        reply,
    });

    const userReply = await newReply.save();
    res.status(201).json({
        success: true,
        data: userReply,
      });
}

const getReply = async(req, res) => {
    const userReply = await DiscussionReply.find();
    res.json({
        success: true,
        data: userReply,
      });
}

const deleteReply = async(req, res) => {
    const {id} = req.params;

    const reply = await DiscussionReply.findOneAndDelete({
        _id: id
    })
    
    if(reply) {
        res.send({
            success: true,
            message: 'Delete Successfully'
        })
    }
}
module.exports = {
    createReply,
    getReply,
    deleteReply
}