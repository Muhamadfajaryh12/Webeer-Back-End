const Category = require("../models/discussionCategory");

const createCategory = async (req, res, next) => {
    const {
        name
    } = req.body

    const isExist = await Category.findOne({
        name: name.toLowerCase()
    });
    
    if(isExist !== null) {
        res.status(400).json({
            success: false,
            message: 'Category already exists'
        });
    } else {
        const discussions = [];
        const newCategory = new Category({
            name: name.toLowerCase(),
            discussions
        });

        const category = await newCategory.save();
        
        res.status(201).json({
            success: true,
            data: category,
        });
    }

}

const getAllCategory = async(req, res) => {
    const discuss = await Category.find();
    res.json({
        success: true,
        data: discuss,
      });
}

const getCategory = async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findOne({
        _id: id
    })
    
    res.status(201).json({
        success: true,
        data: category
    })
}

const deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
        _id: id
    });

    if(category) {
        res.status(201).json({
            success: true,
            message: 'Data deleted successfully'
        })
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getCategory,
    deleteCategory
};