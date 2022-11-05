const mongoose = require ('mongoose');
const User = require('../models/user.js');

const createUser = async(req,res)=>{
    const{
        email,
        password,
    } = req.body
    const newUser = new User({
        email,
        password
    })
    const user = await newUser.save();
    res.status(201).json({
        success:true,
        data:user,
    });
}

const getUser = async (req,res)=>{
    const user = await User.find();
    res.json({
        success: true,
        data: user,
      });
}
module.exports = {
    createUser,
    getUser,
}