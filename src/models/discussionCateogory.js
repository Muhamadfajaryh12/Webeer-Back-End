const { Schema, model } = require("mongoose");

const DiscussionCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

DiscussionCategorySchema.methods.toJSON = function() {
    const discussion = this;

    const {name, _id} = discussion;

    return {
        name,
        id: _id,
    }
}

const DiscussionCategory = model('discussionCategory', DiscussionCategorySchema);
module.exports = DiscussionCategory;