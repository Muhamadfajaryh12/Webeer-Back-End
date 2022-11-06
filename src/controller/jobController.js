const mongoose = require('mongoose');
const Job = require('../models/job.js');
const { nanoid } = require('nanoid');

const createJob = async(req,res) =>{
    const id = nanoid(16);
    const {
        perusahaan,
        pekerjaan,
        deskripsi,
    } = req.body

    const newJob = new Job({
        id,
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
        data:job,
      });
}

const getJobDetail = async(req,res)=>{
    const id = req.params.id;

    const job = await Job.findOne({
        _id:id,
    }).exec();
    
    res.json({
        success: true,
        data: job,
      });
}
const getJobName= async(req,res)=>{
    const {pekerjaan} = req.query;
    if (pekerjaan){
        const job = await Job.find();
        res.json({
            success:true,
            data:job.filter((job)=>job.pekerjaan.toLowerCase().includes(pekerjaan.toLowerCase()))
            .map((job)=>({
            _id:job.id,
            perusahaan:job.perusahaan,
            pekerjaan:job.pekerjaan
            }))
        })  
    }
}
module.exports = {
    createJob,
    getJob,
    getJobDetail,
    getJobName,
}