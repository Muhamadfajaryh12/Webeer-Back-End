const DiscussionReply = require('../models/discussionReply.js');

const createReply = async(req,res) =>{
    const { id } = req.params;
    const {
        user_name_reply,
        reply,
    } = req.body

    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;
    const time = newDate.getTime();

    const newReply = new DiscussionReply({
        user_name_reply,
        date,
        reply,
        discussionId: id,
        time: time
    });

    
    const userReply = await newReply.save();
    // discussions.reply.push()
    // await discussions.save();
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

// const updateReply = async(req, res) => {
//     const { id } = req.params;

//     const {
//         user_name_reply,
//         reply,
//     } = req.body;

//     const userReply = await DiscussionReply.findByIdAndUpdate({
//         user_name_reply,
//         reply
//     })

//     res.json({
//         success: true,
//         data: userReply
//     })
// }

const deleteReply = async(req, res) => {
    const { id } = req.params;

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
    getDiscussionReply,
    // updateReply,
    deleteReply
}