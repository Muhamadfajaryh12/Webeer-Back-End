const express = require("express");
const router = express.Router();
const upload = require('multer')();
const {
    createDiscussion,
    getAllDiscussion,
    deleteDiscussion,
    getDiscussion,
    editDiscussion,
    getUserDiscussion
} = require("../controller/discussionController");
const asyncHandler = require("../utils/asyncHandler");
const verifyToken = require('../middleware/auth');
router.route("/").post(verifyToken,upload.any(), asyncHandler(createDiscussion));
router.route("/").get(verifyToken, asyncHandler(getAllDiscussion));
router.route("/user").get(verifyToken, asyncHandler(getUserDiscussion));
router.route("/:id").get(verifyToken, asyncHandler(getDiscussion));
router.route("/:id").put(verifyToken, upload.any(), asyncHandler(editDiscussion));
router.route("/:id").delete(verifyToken, asyncHandler(deleteDiscussion));
module.exports = router;
