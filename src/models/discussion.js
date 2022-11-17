const { Schema, model } = require('mongoose');

const DiscussionSchema =new Schema(
    {
        username: {
            type: String,
            ref: 'user',
        },
        userid: {
            type: String,
            ref: 'user'
        },
        userimage: {
            type: String,
            ref: 'user'
        },
        date: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        categories: [
            {
                type: Object,
                ref: 'discussioncategory'
            }
        ],
        discussion: {
            type: String,
            required: true
        },
        reply: [
            {
                type: Schema.Types.ObjectId,
                ref: 'discussionreply'
            }
        ],
        isSolved: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

const Discussion = new model('discussion', DiscussionSchema);
module.exports = Discussion;