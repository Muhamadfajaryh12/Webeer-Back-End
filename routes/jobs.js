const express = require("express");
const router = express.Router();
const { Job, validateJob } = require("../models/jobs");

//POST: CREATE A NEW job
router.post("/", async (req, res) => {
  const error = await validateJob(req.body);
  if (error.message) res.status(400).send(error.message);

  job = new Job({
    name: req.body.jobName,
    detail: {
      name: req.body.detailName,
      description: req.body.detailDescription,
    },
    jobTitle: req.body.jobTitle,
  });

  job
    .save()
    .then((job) => {
      res.send(job);
    })
    .catch((error) => {
      res.status(500).send("job was not stored in db");
    });
});

//GET ALL jobS
router.get("/", (req, res) => {
  Job.find()
    .then((jobs) => res.send(jobs))
    .catch((error) => {
      res.status(500).send("Something went wrong");
    });
});

//GET THE job BY ID
router.get("/:jobId", async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) res.status(404).send("job not found");
  res.send(job);
});

//UPDATE job BASED ON ID
router.put("/:jobId", async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.jobId,
    {
      name: req.body.jobName,
      detail: {
        name: req.body.detailName,
        description: req.body.detailDescription,
      },
      jobTitle: req.body.jobTitle
    },
    { new: true }
  );

  if (!updatedJob) res.status(404).send("job not found");
  res.send(updatedJob);
});

//DELETE job BASED ON ID
router.delete("/:jobId", async (req, res) => {
  const job = await Job.findByIdAndRemove(req.params.jobId);
  if (!job) res.status(404).send("job with id not found");
  res.send(job);
});

module.exports = router;
