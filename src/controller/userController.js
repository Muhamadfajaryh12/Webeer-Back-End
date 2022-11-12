const mongoose = require ('mongoose');
const User = require('../models/user.js');
const upload = require('multer')();
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken')
// Register
const createUser = async(req,res)=>
{
    const{
        email,
        password,
        role
    } = req.body
    //Hash
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password,salt)
    
    const newUser = new User({
        email,
        password:hash,
        role
    })
    const validateEmail = await User.findOne({email:email})
    if(validateEmail){
        return res.status(400).json({
            message:'Registrasi Gagal, Email sudah digunakan',
            success:false,
        })
    }
    const user = await newUser.save();
    res.status(201).json({
        success:true,
        data:{
          user:  user,
        }
    });
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
            message:'Login Gagal, Email anda salah',
            error:true
        })
    }
    const passwordUser = await bcrypt.compare(password,user.password)
    if(!passwordUser){
        return res.status(400).json({
            message:'Login Gagal, Password anda salah',
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
    createUser,
    getUser,
    Login,
    Logout
}