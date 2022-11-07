const mongoose = require('mongoose');
const Job = require('../models/job.js');
const { nanoid } = require('nanoid');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
cloudinary.config({
    cloud_name:"webeer",
    api_key :"447617849736884",
    api_secret:"LW69GSs3E5G5aZmesVOazw3nszs",
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Webeer",
    },
  });
  const uploadImg = multer({storage: storage}).single('image');
const createJob = async(req,res) =>{
    const id = nanoid(16);
    // const { filename: image } = req.file;
    // const productImg = cloudinary.url(`${image}.webp`, { width: 700, height: 600, crop: 'scale', quality: 70 });
    const {
        perusahaan,
        pekerjaan,
        tempat,
        deskripsiPerusahaan,
        deskripsiPekerjaan,
        level,
        gaji,
        waktu,
        kondisiKerja,
        test,
        link
    } = req.body

    const newJob = new Job({
        id,
        perusahaan,
        pekerjaan,
        tempat,
        detail:{
        deskripsiPerusahaan,
        deskripsiPekerjaan,
        level,
        gaji,
        waktu,
        kondisiKerja,
        link,
        },
        kualifikasi:[{
            test
        }],
    });
    // image:productImg,

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
            pekerjaan:job.pekerjaan,
            image:job.image
            }))
        })  
    }
}
module.exports = {
    createJob,
    getJob,
    getJobDetail,
    getJobName,
    uploadImg,
}