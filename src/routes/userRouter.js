const express = require("express");
const router = express.Router();
const upload = require('multer')()
const {
    createUser,
    getUser
} = require("../controller/userController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(upload.any(),asyncHandler(createUser));
router.route("/all").get(asyncHandler(getUser))
module.exports = router;
