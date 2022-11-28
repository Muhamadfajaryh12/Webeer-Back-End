const mongoose = require('mongoose');

const JobSchema =new mongoose.Schema({
    companyid:{
        type:String,
        ref:'user',
    },
    company:{
        type:String,
        required:true,
    },
    profession:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    details:{
        descriptionCompany:{
            type:String,
            required:true,
        },
        descriptionProfession:{
            type:String,
            required:true,
        },
        level:{
            type:String,
            required:true,
        },
        salary:{
            type:String,
            required:true,
        },
        salary2:{
            type:String,
            required:true,
        },
        timeWork:{
            type:String,
            required:true,
        },
        workplace:{
            type:String,
            required:true,
        },
        link:{
            type:String,
            required:true
        },
        qualification:{
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