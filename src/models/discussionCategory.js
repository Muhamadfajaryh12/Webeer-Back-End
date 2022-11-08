const { Schema, model } = require("mongoose");

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

DiscussionCategorySchema.methods.toJSON = function() {
    const userdiscussion = this;

    const {name, _id} = userdiscussion;

    return {
        name,
        _id,
    }
}

const DiscussionCategory = model('discussioncategory', DiscussionCategorySchema);
module.exports = DiscussionCategory;