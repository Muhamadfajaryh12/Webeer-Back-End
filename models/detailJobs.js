const mongoose = require('mongoose');

//AUTHOR SCHEMA
const detailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:10,
        maxlength:50
    },
    description:{
        type:String,
        min:10,
        max:200
    }
});

module.exports = new mongoose.model('Detail',detailSchema);