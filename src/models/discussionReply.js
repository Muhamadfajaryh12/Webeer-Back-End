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
        discussion: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Discussion'
            }
        ]
    }
);

DiscussionReplySchema.methods.toJSON = function() {
    const userReply = this.toObject();

    const {user_name_reply, date, reply, _id} = userReply;

    return {
        user_name_reply,
        date,
        reply,
        id: _id
    }
}

const DiscussionReply = model('DiscussionReply', DiscussionReplySchema);
module.exports = DiscussionReply;