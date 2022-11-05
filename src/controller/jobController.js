const mongoose = require('mongoose');
const Job = require('../models/job.js');

const createJob = async(req,res) =>{
    const {
        perusahaan,
        pekerjaan,
        deskripsi,
    } = req.body

    const newJob = new Job({
        perusahaan,
        pekerjaan,
        deskripsi
    });

    const job = await newJob.save();
    res.status(201).json({
        success: true,
        data: job,
      });
}
const getJob =async(req,res)=>{
    const job = await Job.find();
    res.json({
        success: true,
        data: job,
      });
}
module.exports = {
    createJob,
    getJob,
}