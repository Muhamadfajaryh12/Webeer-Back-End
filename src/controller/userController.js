const mongoose = require ('mongoose');
const User = require('../models/user.js');
const upload = require('multer')();
const bcrypt = require('bcryptjs');

// Register
const createUser = async(req,res)=>
{
    const{
        email,
        password,
    } = req.body
    //Hash
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password,salt)
    
    const newUser = new User({
        email,
        password:hash
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
        data:user,
    });
}
//Login
const Login = async(req,res)=>{
    const {
        email,
        password
    } = req.body

    const emailUser = await User.findOne({email:email})
    if(!emailUser){
        return res.status(400).json({
            message:'Email anda salah',
            success:false
        })
    }
    const passwordUser = await bcrypt.compare(password,emailUser.password)
    if(!passwordUser){
        return res.status(400).json({
            message:'Password anda salah',
            success:false
        })
    }

    res.status(200).json({
        message:'Login Berhasil',
        success:true,
        data:emailUser,
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
    Login
}