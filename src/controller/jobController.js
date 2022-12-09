const { ObjectId } = require('mongodb');
const Job = require('../models/job.js');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const User = require('../models/user.js');
const Discussion = require('../models/discussion.js');

cloudinary.config({
  cloud_name: 'webeer',
  api_key: '447617849736884',
  api_secret: 'LW69GSs3E5G5aZmesVOazw3nszs',
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Webeer',
  },
});
const uploadImg = multer({ storage }).single('image');
const createJob = async (req, res) => {
  const jobId = new ObjectId();
  const { user } = req;
  const { filename: image } = req.file;
  const productImg = cloudinary.url(`${image}.webp`, {
    width: 700, height: 600, crop: 'scale', quality: 70,
  });
  const {
    company,
    profession,
    address,
    descriptionCompany,
    descriptionProfession,
    level,
    salary,
    salary2,
    timeWork,
    workplace,
    qualification,
    link,
  } = req.body;

  const newJob = new Job({
    _id: jobId,
    company,
    profession,
    address,
    companyid: user._id,
    details: {
      descriptionCompany,
      descriptionProfession,
      level,
      salary,
      salary2,
      timeWork,
      workplace,
      link,
      qualification,
    },
    image: productImg,
  });
  const job = await newJob.save();

  res.status(201).json({
    success: true,
    message: 'Successfully opened a job vacancy',
    data: job,
  });
};
const getJob = async (req, res) => {
  const job = await Job.find().sort({ updatedAt: -1 });
  res.json({
    success: true,
    data: job,
  });
};

const getCompanyJob = async (req, res) => {
  const company = req.user;

  const job = await Job.find({
    companyid: company._id,
  });

  res.json({
    success: true,
    data: job,
  });
};
const getJobDetail = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOne({
    _id: id,
  }).exec();

  res.json({
    success: true,
    data: job,
  });
};
const getJobOther = async (req, res) => {
  const company = req.params.id;

  const jobs = await Job.find({
    companyid: company,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: jobs,
  });
};
const getJobName = async (req, res) => {
  const { profession } = req.query;
  const job = await Job.find().sort({ updatedAt: -1 });
  if (profession) {
    res.json({
      success: true,
      data: job.filter((job) => job.profession.toLowerCase().includes(profession.toLowerCase()))
        .map((job) => ({
          _id: job.id,
          company: job.company,
          profession: job.profession,
          image: job.image,
          updatedAt: job.updatedAt,
          address: job.address,
        })),
    });
  } else {
    res.json({
      success: true,
      data: job,
    });
  }
};
const editJob = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const {
    company,
    profession,
    address,
    descriptionCompany,
    descriptionProfession,
    level,
    salary,
    salary2,
    timeWork,
    workplace,
    qualification,
    link,
  } = req.body;

  const jobId = await Job.findOne({
    _id: id,
  });

  let userImg = jobId.image;
  if (req.file !== undefined) {
    const { filename: image } = req.file;
    userImg = cloudinary.url(`${image}.webp`, {
      width: 300, height: 300, crop: 'scale', quality: 70,
    });
  }
  if (user._id !== jobId.companyid) {
    return res.status(400).json({
      error: true,
      message: 'There is an error',
    });
  }

  const updateJob = await Job.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        company,
        profession,
        address,
        details: {
          descriptionCompany,
          descriptionProfession,
          level,
          salary,
          salary2,
          timeWork,
          workplace,
          qualification,
          link,
        },
        image: userImg,
      },
    },
  );
  if (!updateJob) {
    res.status(400).json({
      error: true,
      message: 'Data failed to update',
    });
  } else {
    res.status(201).json({
      success: true,
      message: 'Data updated successfully',
    });
  }
};
const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOneAndDelete({
    _id: id,
  });

  if (!job) {
    return res.status(400).json({
      error: true,
      message: 'Oops,there is an error',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'The deletion of this job was successful',
  });
};
module.exports = {
  createJob,
  getJob,
  getJobDetail,
  getJobName,
  uploadImg,
  getCompanyJob,
  deleteJob,
  editJob,
  getJobOther,
};