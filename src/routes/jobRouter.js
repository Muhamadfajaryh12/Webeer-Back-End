const express = require('express');

const router = express.Router();
const {
  createJob,
  getJob,
  getJobDetail,
  getJobName,
  uploadImg,
  getCompanyJob,
  deleteJob,
  editJob,
  getJobOther,
} = require('../controller/jobController');
const asyncHandler = require('../utils/asyncHandler');
const verifyToken = require('../middleware/auth');

router.route('/').post(uploadImg, asyncHandler(createJob));
router.route('/all').get(asyncHandler(getJob));
router.route('/detail/:id').get(asyncHandler(getJobDetail));
router.route('/').get(asyncHandler(getJobName));
router.route('/company').get(asyncHandler(getCompanyJob));
router.route('/:id').delete(asyncHandler(deleteJob));
router.route('/:id').put(uploadImg, asyncHandler(editJob));
router.route('/:id').get(asyncHandler(getJobOther));
module.exports = router;
