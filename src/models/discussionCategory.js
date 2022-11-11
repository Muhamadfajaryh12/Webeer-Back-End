const { Schema, model } = require('mongoose');

const DiscussionCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        discussions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'discussion'
            }
        ]
    }
);

const DiscussionCategory = new model('discussioncategory', DiscussionCategorySchema);
module.exports = DiscussionCategory;
