const mongoose = require("mongoose");

const OTPUserSchema = new mongoose.Schema({
    idUser :{
        type: String,
    },
    OTP:{
        type:String,
    }
})
const OTPUser = new mongoose.model("OTPUser",OTPUserSchema)
module.exports = OTPUser;