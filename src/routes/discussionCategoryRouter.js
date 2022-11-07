const express = require("express");
const router = express.Router();
const {
    createCategory,
    getCategories
} = require("../controller/discussionCategoryController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createCategory));
router.route("/").get(asyncHandler(getCategories));
module.exports = router;
