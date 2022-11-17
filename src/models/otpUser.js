const mongoose = require("mongoose");

const OTPUserSchema = new mongoose.Schema({
    idUser :String,
    OTP :String,
})
const OTPUser = new mongoose.model("OTPUser",OTPUserSchema)
module.exports = OTPUser;