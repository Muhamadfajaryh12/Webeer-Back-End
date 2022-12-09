const express = require('express');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const upload = require('multer')();
const {
  Register,
  getUser,
  Login,
  Logout,
  ResendOTP,
  editUser,
  VerifikasiOTP,
  getUserDetail,
  changePassword,
  resetPassword,
  newResetPassword,
} = require('../controller/userController');
const asyncHandler = require('../utils/asyncHandler');
const { uploadImg } = require('../controller/jobController');

router.route('/register').post(upload.any(), asyncHandler(Register));
router.route('/login').post(upload.any(), asyncHandler(Login));
router.route('/logout').post(verifyToken, upload.any(), asyncHandler(Logout));
router.route('/edit/:id').put(verifyToken, uploadImg, asyncHandler(editUser));
router.route('/').get(verifyToken, asyncHandler(getUser));
router.route('/:id').get(verifyToken, asyncHandler(getUserDetail));
router.route('/resendOTP').post(upload.any(), asyncHandler(ResendOTP));
router.route('/verifikasiOTP').post(upload.any(), asyncHandler(VerifikasiOTP));
router.route('/changePwd/:id').put(verifyToken, upload.any(), asyncHandler(changePassword));
router.route('/resetPwd').post(upload.any(), asyncHandler(resetPassword));
router.route('/newPwd/:id').put(upload.any(), asyncHandler(newResetPassword));
module.exports = router;
