const mongoose = require('mongoose');

const DiscussionSchema =new mongoose.Schema({
    name: {
        type: String,
        ref: "user",
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
            ref: 'discussionCategory'
        }
    ],
    discussion: {
        type: String,
        required: true
    },
    reply: [
        {
            user_name_reply: {
                type: String,
                ref: "user"
            },
            date: {
                type: String,
            },
            reply: {
                type: String,
            }
        }
    ],
    isSolved: {
        type: Boolean,
        required: true
    }
});
const Discussion = new mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;