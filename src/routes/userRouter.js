const express = require("express");
const router = express.Router();
const {
    createUser,
    getUser
} = require("../controller/userController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createUser));
router.route("/all").get(asyncHandler(getUser))
module.exports = router;
