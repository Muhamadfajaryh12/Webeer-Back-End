const express = require("express");
const router = express.Router();
const {
    createReply,
    getReply,
} = require("../controller/discussionReplyController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createReply));
router.route("/").get(asyncHandler(getReply));
module.exports = router;
