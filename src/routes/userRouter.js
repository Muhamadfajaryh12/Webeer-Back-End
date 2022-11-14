const express = require("express");
const verifyToken = require('../middleware/auth')
const router = express.Router();
const upload = require('multer')()
const {
    Register,
    getUser,
    Login,
    Logout,
    ResendOTP
} = require("../controller/userController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/register").post(upload.any(),asyncHandler(Register));
router.route("/login").post(upload.any(),asyncHandler(Login));
router.route("/logout").post(verifyToken,upload.any(),asyncHandler(Logout))
router.route("/").get(asyncHandler(getUser))
router.route("/resendOTP").post(upload.any(),asyncHandler(ResendOTP))
module.exports = router;
