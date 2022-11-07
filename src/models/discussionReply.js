const { Schema, model } = require("mongoose");

const DiscussionReplySchema = new Schema(
    {
        user_name_reply: {
            type: String,
            ref: 'User'
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

const DiscussionReply = model('DiscussionReply', DiscussionReplySchema);
module.exports = DiscussionReply;