const mongoose = require('mongoose');

const DiscussionSchema =new mongoose.Schema({
    name: {
        type: String,
        ref: 'User',
    },
    date: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DiscussionCategory'
        }
    ],
    discussion: {
        type: String,
        required: true
    },
    reply: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DiscussionReply'
        }
    ],
    isSolved: {
        type: Boolean,
        required: true
    }
});
const Discussion = new mongoose.model('Discussion', DiscussionSchema);
module.exports = Discussion;