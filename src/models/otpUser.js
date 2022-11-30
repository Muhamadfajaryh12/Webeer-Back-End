const mongoose = require("mongoose");

const OTPUserSchema = new mongoose.Schema({
    idUser :String,
    OTP :String,
    createdAt:Date,
    expiresAt:Date,
},
)
const OTPUser = new mongoose.model("OTPUser",OTPUserSchema)
module.exports = OTPUser;