const { ObjectId } = require("mongodb")
const Discussion = require("../models/discussion")
const Category = require("../models/discussionCategory")

const createCategory = async (req, res, next) => {
    const { id } = req.params;
    const categoryID = new ObjectId();

    const{
        name
    } = req.body

    const discussion = await Discussion.findOne({
        _id: id
    })

    const newCategory = new Category({
        _id: categoryID,
        name,
        discussions: id
    })

    const category = await newCategory.save();

    discussion.categories.push(categoryID);
    await discussion.save()
    
    res.status(201).json({
        success: true,
        data: category,
    });
}

const getCategories = async (req, res, next) => {
    const categories = await Category.find();

    res.json({
        success: true,
        data: categories
    });
};

module.exports = {
    createCategory,
    getCategories
};