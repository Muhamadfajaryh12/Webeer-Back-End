const express = require("express");
const router = express.Router();
const upload = require('multer')()
const {
    createUser,
    getUser,
    Login
} = require("../controller/userController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/register").post(upload.any(),asyncHandler(createUser));
router.route("/login").post(upload.any(),asyncHandler(Login));
router.route("/").get(asyncHandler(getUser))

module.exports = router;
