const express = require("express");
const router = express.Router();
const {
    createReply,
    deleteReply,
    getDiscussionReply,
    updateReply,
} = require("../controller/discussionReplyController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/:id").post(asyncHandler(createReply));
router.route("/:id").get(asyncHandler(getDiscussionReply));
router.route("/:id").put(asyncHandler(updateReply));
router.route("/:id").delete(asyncHandler(deleteReply));
module.exports = router;
