const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
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
    },
    isVerify:{
        type:Boolean,
    },
    token:{
        type:String
    }
})
const User = new mongoose.model("User",UserSchema);
module.exports = User;