const Category = require("../models/discussionCategory")

const createCategory = async (req, res, next) => {
    const{
        name
    } = req.body
    const newCategory = new Category({
        name
    })
    const category = await newCategory.save();
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