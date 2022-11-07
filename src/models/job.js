const mongoose = require('mongoose');

const JobSchema =new mongoose.Schema({
    perusahaan:{
        type:String,
        required:true,
    },
    pekerjaan:{
        type:String,
        required:true,
    },
    deskripsi:{
        type:String,
        required:true
    },
    image:{
        type: String
      }
})
const Job = new mongoose.model("Job",JobSchema);
module.exports = Job;