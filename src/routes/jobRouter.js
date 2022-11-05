const express = require("express");
const router = express.Router();
const aysncHandler= require("../utils/asyncHandler");
const {
    createJob,
    getJob
} = require("../controller/jobController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createJob));
router.route("/all").get(asyncHandler(getJob))
module.exports = router;
