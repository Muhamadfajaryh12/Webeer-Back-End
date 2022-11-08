const express = require("express");
const router = express.Router();
const upload = require('multer')();
const {
    createCategory,
    getCategories
} = require("../controller/discussionCategoryController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/:id").post(upload.any(), asyncHandler(createCategory));
router.route("/").get(asyncHandler(getCategories));
module.exports = router;
