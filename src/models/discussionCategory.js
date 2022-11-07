const { Schema, model } = require("mongoose");

const DiscussionCategorySchema = new Schema(
    {
        name: {
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

DiscussionCategorySchema.methods.toJSON = function() {
    const userdiscussion = this;

    const {name, _id} = userdiscussion;

    return {
        name,
        id: _id,
    }
}

const DiscussionCategory = model('DiscussionCategory', DiscussionCategorySchema);
module.exports = DiscussionCategory;