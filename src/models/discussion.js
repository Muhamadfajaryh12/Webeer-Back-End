const mongoose = require('mongoose');

const DiscussionSchema =new mongoose.Schema({
    name: {
        type: String,
        ref: 'user',
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'discussionreply'
        }
    ],
    isSolved: {
        type: Boolean,
        required: true
    }
});

// DiscussionSchema.methods.toJSON = function() {
//     const discussions = this.toObject();

//     const {_id, ...rest} = discussions;

//     return {
//         _id,
//         ...rest
//     }
// }
const Discussion = new mongoose.model('discussion', DiscussionSchema);
module.exports = Discussion;