const Discussion = require('../models/discussion.js');

const createDiscussion = async(req,res) =>{
    const {
        name,
        title,
        discussion,
    } = req.body

    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;
    const categories =[];
    const reply = [];
    const isSolved = false;

    const newDiscussion = new Discussion({
        name,
        date,
        title,
        categories,
        discussion,
        reply,
        isSolved,
    });

    const discuss = await newDiscussion.save();
    res.status(201).json({
        success: true,
        data: discuss,
      });
}

const getDiscussion = async(req, res) => {
    const discuss = await Discussion.find();
    res.json({
        success: true,
        data: discuss,
      });
}

const deleteDiscussion = async(req, res) => {
    const {id} = req.params;

    const discuss = await Discussion.findOneAndDelete({
        _id: id
    })

    if(discuss) {
        res.send({
            success: true,
            message: 'Delete Successfully'
        })
    }
}
module.exports = {
    createDiscussion,
    getDiscussion,
    deleteDiscussion
}