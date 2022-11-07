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
    tempat:{
        type:String,
        required:true,
    },
    detail:{
        deskripsiPerusahaan:{
            type:String,
            required:true,
        },
        deskripsiPekerjaan:{
            type:String,
            required:true,
        },
        level:{
            type:String,
            required:true,
        },
        gaji:{
            type:String,
            required:true,
        },
        waktu:{
            type:String,
            required:true,
        },
        kondisiKerja:{
            type:String,
            required:true,
        },
        kualifikasi:{
            name:{
                type:[]
            }
        },
        link:{
            type:String,
            required:true
        }
    },
    image:{
        type: String
      },
    },
{ timestamps: true }
)
const Job = new mongoose.model("Job",JobSchema);
module.exports = Job;