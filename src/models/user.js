const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    isVerify:{
        type:Boolean,
    }
})
const User = new mongoose.model("User",UserSchema);
module.exports = User;