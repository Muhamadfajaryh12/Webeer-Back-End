const { Schema, model } = require('mongoose');

const DiscussionReplySchema = new Schema(
    {
        username: {
            type: String,
            ref: 'user'
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
        reply: {
            type: String,
            required: true
        },
        discussionId: {
            type: Schema.Types.ObjectId,
            ref: 'discussion'
        }
    },
    { timestamps: true }
);

const DiscussionReply = new model('discussionreply', DiscussionReplySchema);
module.exports = DiscussionReply;