const express = require("express");
const router = express.Router();
const {
    createJob,
    getJob,
    getJobDetail
} = require("../controller/jobController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createJob));
router.route("/all").get(asyncHandler(getJob));
router.route("/detail/:id").get(asyncHandler(getJobDetail));
module.exports = router;
