const express = require('express');

const router = express.Router();
const upload = require('multer')();
const {
  createCategory,
  getAllCategory,
  getCategory,
  deleteCategory,
} = require('../controller/discussionCategoryController');
const asyncHandler = require('../utils/asyncHandler');

router.route('/').post(upload.any(), asyncHandler(createCategory));
router.route('/').get(asyncHandler(getAllCategory));
router.route('/:id').get(asyncHandler(getCategory));
router.route('/:id').delete(asyncHandler(deleteCategory));
module.exports = router;
