const { ObjectId } = require('mongodb');
const Discussion = require('../models/discussion.js');
const Category = require('../models/discussionCategory.js');
const DiscussionReply = require('../models/discussionReply.js');
const User = require('../models/user.js');

const createDiscussion = async(req,res) =>{
    const user = req.user;
    const discussionID = new ObjectId();
    const {
        title,
        discussion,
        categories
    } = req.body;

    const nameuser = await User.findOne({
        _id: user
    })
    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;
    const reply = [];
    const isSolved = false;
    if(typeof(categories) === 'object') {
        categories.forEach(async(category) => {
            const isExist = await Category.findOne({
                name: category.toLowerCase()
            });
            
            if(isExist !== null) {
                isExist.discussions.push(discussionID);
                await isExist.save();
            }
        });
    } else {
        const isExist = await Category.findOne({
            name: categories.toLowerCase()
        });
        
        if(isExist !== null) {
            isExist.discussions.push(discussionID);
            await isExist.save();
        }
    }

    const newDiscussion = new Discussion({
        _id: discussionID,
        name: nameuser.email,
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

const getAllDiscussion = async(req, res) => {
    const discuss = await Discussion.find();
    res.json({
        success: true,
        data: discuss,
      });
}

const getDiscussion = async(req, res) => {
    const { id } = req.params;

    const discussion = await Discussion.findOne({
        _id: id
    }).populate('discussion');

    res.json({
        success: true,
        data: discussion
    })
}

const editDiscussion = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const {
        title,
        categories,
        discussion,
        isSolved
    } = req.body;

    const nameuser = await User.findOne({
        _id: user
    })

    const discussionId = await Discussion.findOne({
        _id: id
    })

    if(nameuser.email !== discussionId.name) {
        res.status(400).json({
            success: false,
            message: 'Tidak dapat melakukan edit pada diskusi ini'
        })
    }
    const newDate = new Date();
    const monthID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = `${newDate.getDate()} ${monthID[newDate.getMonth()]} ${newDate.getFullYear()}`;

    const category = await Category.find({
        discussions: id
    })

    const arrCategory = [];
    category.forEach((c) => {
        arrCategory.push(c.name);
    })

    let count = 0;
    if (typeof(categories) === 'object') {
        while(count < categories.length) {
            if (arrCategory.includes(categories[count]) === false) {
                const categoryNotAdded = await Category.findOne({
                    name: categories[count]
                })

                categoryNotAdded.discussions.push(id);
                await categoryNotAdded.save();
            }
            
            count++;
        }
    } else {
        if (arrCategory.includes(categories) === false) {
            const categoryNotAdded = await Category.findOne({
                name: categories
            })
    
            categoryNotAdded.discussions.push(id);
            await categoryNotAdded.save();
        }
    }

    count = 0;
    while(count < arrCategory.length) {
        if (categories.includes(arrCategory[count]) === false) {
            const categoryNotFound = await Category.findOne({
                name: arrCategory[count]
            })

            const index = categoryNotFound.discussions.findIndex((discussionsId) => discussionsId.toString() === id);

            if (index !== -1) {
                categoryNotFound.discussions.splice(index, 1);
            }

            await categoryNotFound.save();
        }
        count++;
    }

    const discuss = await Discussion.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                title,
                categories,
                discussion,
                date,
                isSolved
            }
        }
    );

    if(discuss) {
        res.status(201).json({
            success: true,
            data: discuss,
            message: 'Data berhasil diupdate'
        })
    }
}

const deleteDiscussion = async(req, res) => {
    const { id } = req.params;
    const user = req.user;

    const nameuser = await User.findOne({
        _id: user
    })

    const discussionId = await Discussion.findOne({
        _id: id
    })

    if(nameuser.email !== discussionId.name) {
        res.status(400).json({
            success: false,
            message: 'Tidak dapat melakukan edit pada diskusi ini'
        })
    }

    const discussion = await Discussion.findOneAndDelete({
        _id: id
    });

    discussion.categories.forEach(async (discuss) => {
        const category = await Category.findOne({
            name: discuss.toLowerCase()
        });

        const index = category.discussions.findIndex((discussionsId) => discussionsId.toString() === id);

        if (index !== -1) {
            category.discussions.splice(index, 1);
        }

        await category.save();
    })
    
    discussion.reply.forEach(async (discuss) => {
        await DiscussionReply.findOneAndDelete({
            _id: discuss
        });
    })

    if(discussion) {
        res.send({
            success: true,
            message: 'Delete Successfully'
        })
    }
}
module.exports = {
    createDiscussion,
    getAllDiscussion,
    getDiscussion,
    editDiscussion,
    deleteDiscussion
};