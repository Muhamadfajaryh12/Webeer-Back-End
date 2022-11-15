const mongoose = require ('mongoose');
const User = require('../models/user.js');
const upload = require('multer')();
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken')
const OTPUser = require('../models/otpUser')
const nodemailer = require('nodemailer')
// Register

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:"webeercapstone@gmail.com",
        pass:"uyjzvwhlnofypdzp"
    }
})


const Register = async(req,res)=>
{
    const{
        username,
        email,
        password,
     
    } = req.body
    //Hash
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password,salt)
    
    const newUser = new User({
        username,
        email,
        password:hash,
        isVerify:false,
 
    })
    const validateEmail = await User.findOne({email:email})
    if(validateEmail){
        return res.status(400).json({
            message:'Registrasi Gagal, Email sudah digunakan',
            error:true
        })
    }
    const user = await newUser.save().then((result)=>{
        SendOTP(result,res)
    })
    res.status(201).json({
        success:true,
        message:'Registrasi Berhasil',
        data:user
    });
}
const SendOTP = async ({_id,email},res) =>{
    try{
        function generatePassword() {
            const length = 5;
            const charset = '0123456789';
            let retVal = '';
            for (let i = 0, n = charset.length; i < length; ++i) {
              retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
          }
          const mailOptions ={
            from:'webeercapstone@gmail.com',
            to:email,
            subject:"Verify Your Account",
            html:generatePassword()
          }
          const newOTPUser = await new OTPUser({
            idUser:_id,
            otp:generatePassword()
          })
          await newOTPUser.save();
          await transporter.sendMail(mailOptions);
          res.json({
            status:'PENDING',
            message:'Verification OTP Email send',
            data:{
                idUser:_id,
                email,
            } 
          })

    }
    catch(error){
        res.json({
            status:"FAILED",
            message:'error message',
        })
    }
}
const ResendOTP= async(req,res)=>{
    try{
        let{idUser,email}=req.body;

        if(!idUser  || !email){
            throw Error ("Empty user details are not allowed");
        }
        else{
            await OTPUser.deleteMany({idUser});
            SendOTP({_id:idUser,email},res);
        }   
    }
    catch(error){
            res.json({
                status:"FAILED",
                message:"Error resend",
            })
    }   
}
//Login
const Login = async(req,res)=>{
    const {
        email,
        password,
        } = req.body

    const user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({
            message:'Login tidak berhasil, Maaf email anda salah',
            error:true
        })
    }
    const passwordUser = await bcrypt.compare(password,user.password)
    if(!passwordUser){
        return res.status(400).json({
            message:'Login tidak berhasil, Maaf password anda salah',
            error:true
        })
    }
    
    const generateToken = jwt.sign({ _id:user._id}, process.env.SECRET_KEY)
    res.header('auth',generateToken)
    user.token=generateToken
    return res.json({
        token:generateToken,
        user:user,
        message:'Login Berhasil',
    })


    }
    //logout
const Logout = async(req,res)=>{
    const user = req.user;
    const token = req.token;
    if (user.token !==token){
        res.json({
            error:true,
            message:"Terjadi Kesalahan",
        })
    }
    res.json({
    success: true,
    message:"Anda Berhasil Logout"
    });


    
  }
const getUser = async (req,res)=>{
    const user = await User.find();
    res.status(200).json({
        success: true,
        data: user,
      });
}

module.exports = {
    Register,
    getUser,
    Login,
    Logout,
    ResendOTP,
}