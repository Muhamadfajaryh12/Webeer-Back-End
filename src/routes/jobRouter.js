const express = require("express");
const router = express.Router();
const {
    createJob,
    getJob,
    getJobDetail,
    getJobName
} = require("../controller/jobController");
const asyncHandler = require("../utils/asyncHandler");
router.route("/").post(asyncHandler(createJob));
router.route("/all").get(asyncHandler(getJob));
router.route("/detail/:id").get(asyncHandler(getJobDetail));
router.route("/").get(asyncHandler(getJobName));
module.exports = router;
