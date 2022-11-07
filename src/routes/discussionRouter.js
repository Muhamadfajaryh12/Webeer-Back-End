const express = require("express");
const router = express.Router();
const {
    createDiscussion,
    getAllDiscussion,
    deleteDiscussion,
    getDiscussion
} = require("../controller/discussionController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createDiscussion));
router.route("/").get(asyncHandler(getAllDiscussion));
router.route("/:id").get(asyncHandler(getDiscussion));
router.route("/:id").delete(asyncHandler(deleteDiscussion));
module.exports = router;
