const express = require("express");
const router = express.Router();
const {
    createDiscussion,
    getDiscussion
} = require("../controller/discussionController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createDiscussion));
router.route("/").get(asyncHandler(getDiscussion))
module.exports = router;
