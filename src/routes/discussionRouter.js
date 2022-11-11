const express = require("express");
const router = express.Router();
const upload = require('multer')();
const {
    createDiscussion,
    getAllDiscussion,
    deleteDiscussion,
    getDiscussion,
    editDiscussion
} = require("../controller/discussionController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(upload.any(), asyncHandler(createDiscussion));
router.route("/").get(asyncHandler(getAllDiscussion));
router.route("/:id").get(asyncHandler(getDiscussion));
router.route("/:id").put(upload.any(), asyncHandler(editDiscussion));
router.route("/:id").delete(asyncHandler(deleteDiscussion));
module.exports = router;
