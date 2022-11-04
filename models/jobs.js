const mongoose = require("mongoose");
const Detail = require("./detailJobs");
const yup = require("yup");

//job SCHEMA
const JobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  detail: Detail.schema,
  jobTitle: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
});

const validateJob = (job) => {
  const schema = yup.object().shape({
    jobName: yup.string().required().min(3).max(50),
    detailName: yup.string().required().min(3).max(40),
    detailDescription: yup
      .string()
      .required()
      .min(10, "must be greater than 10")
      .max(100, "must be less than 100"),
    jobTitle: yup.string().required().min(3).max(20),
  });

  return schema
    .validate(job)
    .then((job) => job)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Job = new mongoose.model("Job", JobSchema);
exports.validateJob = validateJob;
