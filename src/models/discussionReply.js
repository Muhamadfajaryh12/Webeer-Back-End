const mongoose = require('mongoose');

const DiscussionReplySchema = new mongoose.Schema(
    {
        user_name_reply: {
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'discussion'
        },
        time: {
            type: String,
            required: true
        }
    }
);

DiscussionReplySchema.methods.toJSON = function() {
    const userReply = this;

    const {user_name_reply, date, reply, _id, time} = userReply;

    return {
        _id,
        user_name_reply,
        date,
        reply,
        time
    }
}

const DiscussionReply = new mongoose.model('discussionreply', DiscussionReplySchema);
module.exports = DiscussionReply;