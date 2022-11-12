const express = require("express");
const verifyToken = require('../middleware/auth')
const router = express.Router();
const upload = require('multer')()
const {
    createUser,
    getUser,
    Login,
    Logout
} = require("../controller/userController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/register").post(upload.any(),asyncHandler(createUser));
router.route("/login").post(upload.any(),asyncHandler(Login));
router.route("/logout").post(verifyToken,upload.any(),asyncHandler(Logout))
router.route("/").get(asyncHandler(getUser))

module.exports = router;
