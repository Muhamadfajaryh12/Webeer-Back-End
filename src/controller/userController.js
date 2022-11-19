const mongoose = require ('mongoose');
const User = require('../models/user.js');
const upload = require('multer')();
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken')
const OTPUser = require('../models/otpUser')
const nodemailer = require('nodemailer')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const Discussion = require('../models/discussion.js');
const DiscussionReply = require('../models/discussionReply.js');
cloudinary.config({
    cloud_name:"webeer",
    api_key :"447617849736884",
    api_secret:"LW69GSs3E5G5aZmesVOazw3nszs",
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Webeer",
    },
  });
const uploadImg = multer({storage: storage}).single('image');
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
        role
     
    } = req.body
    //Hash
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password,salt);
    const image = 'https://res.cloudinary.com/webeer/image/upload/v1668505113/Webeer/avatardefault300_muem41.jpg';
    
    const newUser = new User({
        username,
        email,
        image,
        password:hash,
        role,
        isVerify:false,
 
    })
    const validateEmail = await User.findOne({email:email})
    if(validateEmail){
        return res.status(400).json({
            message:'Registrasi Gagal, Email sudah digunakan',
            error:true
        })
    }
        newUser.save().then((result)=>{
        SendOTP(result,res)
    })
  
}
const SendOTP = async ({_id,email},res) =>{

            function generatePassword() {
                const length = 5;
                const charset = '0123456789';
                let retVal = '';
                for (let i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                return retVal;
            }
          const getOTP = generatePassword();
          const mailOptions ={
            from:'webeercapstone@gmail.com',
            to:email,
            subject:"Verify Your Account",
            html: `Segera masukkan kode OTP anda ${getOTP} <b> Kode akan hangus setelah 5 menit </b>`
          }
          const newOTPUser = await new OTPUser({
            idUser:_id,
            OTP: getOTP,
            createAt    : Date.now(),
            expiresAt   : Date.now() + 30000
          })
          await transporter.sendMail(mailOptions);
          newOTPUser.save();
          res.status(200).json({
            message:'Verification OTP Email send',
            success:true,
            data:{
                idUser:_id,
                email,
            } 
          })

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

//Verify
const VerifikasiOTP = async(req,res)=>{
    try{
       let { idUser , OTP } = req.body;
            const UserOTPVerifikasi = await OTPUser.find({
                idUser,
            });
            if( UserOTPVerifikasi.length <= 0){
                res.status(400).json({
                    error:true,
                    message:"Silahkan buat akun terlebih dahulu",
                })
            }
            else{
                const {expiresAt} =  UserOTPVerifikasi[0];
                if(expiresAt < Date.now()){
                    await OTPUser.deleteMany({idUser});
                    res.status(400).json({
                        error:true,
                        message:"Kode OTP anda sudah expired",
                    })
                }
                else{
                    const validateOTP = await UserOTPVerifikasi[0].OTP;
                    if(validateOTP !== OTP){
                        res.status(400).json({
                            error:true,
                            message:"Kode OTP yang anda masukan salah, silahkan coba kembali",
                        })
                    }
                    else{
                        await User.updateOne({_id:idUser},{isVerify:true});
                        await OTPUser.deleteMany({idUser});
                        res.status(200).json({
                            success:true,
                            message:"Selamat anda berhasil verifikasi akun, silahkan login",
                        })
                    }
                }
            }
        
    }
    catch(error){
        res.status(400).json({
            error:true,
            message:"Terjadi kesalahan, gagal verifikasi akun"
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
    const verifikasi = await user.isVerify
    if(!verifikasi){
        return res.status(400).json({
            message:'Login tidak berhasil, Akun anda tidak terverifikasi',
            error:true,
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
// const getUser = async (req,res)=>{
//     const user = await User.find();
//     res.status(200).json({
//         success: true,
//         data: user,
//       });
// }
 
const getUser = async (req, res) => {
    const user = req.user;

    const userprofile = await User.findOne({
        _id: user._id
    });

    const datauser = new User({
        _id: user._id,
        username: userprofile.username,
        email: userprofile.email,
        contact: userprofile.contact,
        profesi: userprofile.profesi,
        bio: userprofile.bio,
        image: userprofile.image
    })

    res.json({
        success: true,
        data: datauser
    })
}

const getUserDetail = async (req,res)=>{
    const id = req.params.id;
    const userDetail = await User.findOne({
        _id:id
    }).exec();

    res.json({
        success:true,
        data:userDetail
    })
}
const editUser = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const olduser = await User.findOne({
        _id: id
    });

    let userImg = olduser.image;
    if (req.file !== undefined) {
        const { filename: image } = req.file;
        userImg = cloudinary.url(`${image}.webp`, { width: 300, height: 300, crop: 'scale', quality: 70 });

        const updateUserImage = await Discussion.find({
            userid: id
        })

        console.log(updateUserImage)
    }

    const {
        username,
        email,
        contact,
        profesi,
        bio,
    } = req.body;

    if (user._id !== id) {
        res.status(400).json({
            error: true,
            message: 'Tidak dapat mengubah profile'
        })
        return
    }

    const discussions = await Discussion.find({
        userid: user._id
    })

    if(discussions.length !== 0) {
        discussions.forEach(async (discussionId) => {
            const editDiscussion = await Discussion.findOneAndUpdate(
                { _id: discussionId._id },
                {
                    $set: {
                        username: username,
                        userimage: userImg
                    }
                }
            );
    
            await editDiscussion.save();
        })
    }

    const discussionReply = await DiscussionReply.find({
        userid: user._id
    })

    if(discussionReply.length !== 0) {
        discussionReply.forEach(async (discussionId) => {
            const editDiscussionReply = await DiscussionReply.findOneAndUpdate(
                { _id: discussionId._id },
                {
                    $set: {
                        username: username,
                        userimage: userImg
                    }
                }
            );
    
            await editDiscussionReply.save();
        })
    }

    const edituser = await User.findOneAndUpdate(
        {_id: user._id},
        {
            $set: {
                username,
                email,
                contact,
                profesi,
                bio,
                image: userImg
            }
        }
    );
    
    if (!edituser) {
        res.status(400).json({
            error:true,
            message:'Data gagal untuk diperbaharui'
        })
    }
    res.status(201).json({
        success: true,
        message: 'Data berhasil diubah'
    })
}

module.exports = {
    Register,
    getUser,
    Login,
    Logout,
    ResendOTP,
    VerifikasiOTP,
    editUser,
    uploadImg,
    getUserDetail
}