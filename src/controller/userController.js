const mongoose = require('mongoose');
const User = require('../models/user.js');
const upload = require('multer')();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const OTPUser = require('../models/otpUser');
const Discussion = require('../models/discussion.js');
const DiscussionReply = require('../models/discussionReply.js');

cloudinary.config({
  cloud_name: 'webeer',
  api_key: '447617849736884',
  api_secret: 'LW69GSs3E5G5aZmesVOazw3nszs',
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Webeer',
  },
});
const uploadImg = multer({ storage }).single('image');
// Register

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'webeercapstone@gmail.com',
    pass: 'uyjzvwhlnofypdzp',
  },
});

const Register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,

  } = req.body;
  // Hash
  const salt = await bcrypt.genSalt(6);
  const hash = await bcrypt.hash(password, salt);
  const image = 'https://res.cloudinary.com/webeer/image/upload/v1668505113/Webeer/avatardefault300_muem41.jpg';

  const newUser = new User({
    username,
    email,
    image,
    password: hash,
    role,
    isVerify: false,

  });
  const validateEmail = await User.findOne({ email });
  if (validateEmail) {
    return res.status(400).json({
      message: 'Registration Failed, Email already in use',
      error: true,
    });
  }
  newUser.save().then((result) => {
    SendOTP(result, res);
  });
};
const SendOTP = async ({ _id, email }, res) => {
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
  const mailOptions = {
    from: 'webeercapstone@gmail.com',
    to: email,
    subject: 'Verify Your Account',
    html: `Segera masukkan kode OTP anda ${getOTP} <b> Kode akan hangus setelah 5 menit </b>`,
  };
  const newOTPUser = await new OTPUser({
    idUser: _id,
    OTP: getOTP,
    createAt: Date.now(),
    expiresAt: Date.now() + 300000,
  });
  await transporter.sendMail(mailOptions);
  newOTPUser.save();
  res.status(200).json({
    message: 'Verification OTP Email send',
    success: true,
    data: {
      idUser: _id,
      email,
    },
  });
};

const ResendOTP = async (req, res) => {
  try {
    const { idUser, email } = req.body;

    if (!idUser || !email) {
      throw Error('Empty user details are not allowed');
    } else {
      await OTPUser.deleteMany({ idUser });
      SendOTP({ _id: idUser, email }, res);
    }
  } catch (error) {
    res.json({
      status: 'FAILED',
      message: 'Error resend',
    });
  }
};

// Verify
const VerifikasiOTP = async (req, res) => {
  try {
    const { idUser, OTP } = req.body;
    const UserOTPVerifikasi = await OTPUser.find({
      idUser,
    });
    if (UserOTPVerifikasi.length <= 0) {
      res.status(400).json({
        error: true,
        message: 'Please create an account first',
      });
    } else {
      const { expiresAt } = UserOTPVerifikasi[0];
      if (expiresAt < Date.now()) {
        await OTPUser.deleteMany({ idUser });
        await User.deleteMany({ _id: idUser });
        res.status(400).json({
          error: true,
          message: 'Your OTP code has expired',
        });
      } else {
        const validateOTP = await UserOTPVerifikasi[0].OTP;
        if (validateOTP !== OTP) {
          res.status(400).json({
            error: true,
            message: 'The OTP code you entered was incorrect, please try again',
          });
        } else {
          await User.updateOne({ _id: idUser }, { isVerify: true });
          await OTPUser.deleteMany({ idUser });
          res.status(200).json({
            success: true,
            message: 'Congratulations, you have successfully verified your account, please login',
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'An error occurred, account verification failed',
    });
  }
};

// Login
const Login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: 'Login unsuccessful, your email is incorrect',
      error: true,
    });
  }
  const passwordUser = await bcrypt.compare(password, user.password);
  if (!passwordUser) {
    return res.status(400).json({
      message: 'Login failed, your password is wrong',
      error: true,
    });
  }
  const verifikasi = await user.isVerify;
  if (!verifikasi) {
    return res.status(400).json({
      message: 'Login unsuccessful, Your account is not verified',
      error: true,
    });
  }
  const generateToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res.header('auth', generateToken);
  user.token = generateToken;
  return res.json({
    token: generateToken,
    user,
    message: 'You have successfully logged in',
  });
};
// logout
const Logout = async (req, res) => {
  const { user } = req;
  const { token } = req;
  if (user.token !== token) {
    res.json({
      error: true,
      message: 'There is an error',
    });
  }
  res.json({
    success: true,
    message: 'You have successfully logged out',
  });
};

const getUser = async (req, res) => {
  const { user } = req;

  const userprofile = await User.findOne({
    _id: user._id,
  });

  const datauser = new User({
    _id: user._id,
    username: userprofile.username,
    email: userprofile.email,
    contact: userprofile.contact,
    profesi: userprofile.profesi,
    country: userprofile.country,
    bio: userprofile.bio,
    image: userprofile.image,
    address: userprofile.address,
    website: userprofile.website,
    employee: userprofile.employee,
    employee2: userprofile.employee2,
    industry: userprofile.industry,
    founded: userprofile.founded,
    specialities: userprofile.specialities,
  });

  res.json({
    success: true,
    data: datauser,
  });
};

const getUserDetail = async (req, res) => {
  const { id } = req.params;
  const userDetail = await User.findOne({
    _id: id,
  }).exec();

  res.json({
    success: true,
    data: userDetail,
  });
};
const editUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const olduser = await User.findOne({
    _id: id,
  });

  let userImg = olduser.image;
  if (req.file !== undefined) {
    const { filename: image } = req.file;
    userImg = cloudinary.url(`${image}.webp`, {
      width: 300, height: 300, crop: 'scale', quality: 70,
    });
  }

  const {
    username,
    email,
    contact,
    profesi,
    bio,
    country,
    address,
    website,
    employee,
    employee2,
    industry,
    founded,
    specialities,
  } = req.body;

  if (user._id !== id) {
    res.status(400).json({
      error: true,
      message: 'Unable to change profile data',
    });
    return;
  }

  const discussions = await Discussion.find({
    userid: user._id,
  });

  if (discussions.length !== 0) {
    discussions.forEach(async (discussionId) => {
      const editDiscussion = await Discussion.findOneAndUpdate(
        { _id: discussionId._id },
        {
          $set: {
            username,
            userimage: userImg,
          },
        },
      );

      await editDiscussion.save();
    });
  }

  const discussionReply = await DiscussionReply.find({
    userid: user._id,
  });

  if (discussionReply.length !== 0) {
    discussionReply.forEach(async (discussionId) => {
      const editDiscussionReply = await DiscussionReply.findOneAndUpdate(
        { _id: discussionId._id },
        {
          $set: {
            username,
            userimage: userImg,
          },
        },
      );

      await editDiscussionReply.save();
    });
  }

  const edituser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        username,
        email,
        contact,
        profesi,
        bio,
        country,
        address,
        website,
        employee,
        employee2,
        industry,
        founded,
        specialities,
        image: userImg,
      },
    },
  );

  if (!edituser) {
    res.status(400).json({
      error: true,
      message: 'Data failed to update',
    });
  }
  res.status(201).json({
    success: true,
    message: 'Data updated successfully',
  });
};
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const { newPassword, confirmPassword, oldPassword } = req.body;
  if (user._id !== id) {
    res.status(400).json({
      message: 'There is an error',
      error: true,
    });
    return;
  }

  const olduser = await User.findOne({
    _id: id,
  });

  const userPassword = await bcrypt.compare(oldPassword, olduser.password);
  if (!userPassword) {
    return res.status(400).json({
      message: 'Sorry, your old password doesnt match, please try again',
      error: true,
    });
  }

  if (newPassword != confirmPassword) {
    return res.status(400).json({
      message: 'Sorry, your new passwords dont match, please try again',
      error: true,
    });
  }
  const salt = await bcrypt.genSalt(6);
  const hash = await bcrypt.hash(newPassword, salt);
  const updateUser = await User.findOneAndUpdate({ _id: user._id }, { password: hash });
  if (!updateUser) {
    res.status(400).json({
      message: 'Password update failed',
      error: true,
    });
  }
  res.status(200).json({
    success: true,
    message: 'Password successfully changed',
  });
};
const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: 'Your email was not found',
      error: true,
    });
  }

  const url = `http://localhost:9000/#/resetpassword/${user._id}`;
  const url2 = `https://webeer.netlify.app/#/resetpassword/${user._id}`;
  const url3 = `http://127.0.0.1:8080/#/resetpassword/${user._id}`;
  const mailOptions = {
    from: 'webeercapstone@gmail.com',
    to: email,
    subject: 'Reset Password Your Account',
    html: `<p>Please click this link to reset your password<span> <a href="${url2}"><span>Reset Password Server Main</span></a></span><span> <a href="${url}"><span>Reset Password Server 2</span></a></span><span> <a href="${url3}"><span>Reset Password Server 3</span></a></span></p>
          <p>Make sure this message is safe, if not, please select (seems safe) then refresh.</p>      
    `,
  };
  await transporter.sendMail(mailOptions);
  res.status(200).json({
    message: 'Please check your email for password reset',
    success: true,

  });
};
const newResetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (newPassword != confirmPassword) {
    return res.status(400).json({
      message: 'Sorry, your new passwords dont match, please try again',
      error: true,
    });
  }

  const salt = await bcrypt.genSalt(6);
  const hash = await bcrypt.hash(newPassword, salt);
  const updateUser = await User.findOneAndUpdate({ _id: id }, { password: hash });
  if (!updateUser) {
    res.status(400).json({
      message: 'Password update failed',
      error: true,
    });
  }
  res.status(200).json({
    success: true,
    message: 'Password successfully changed',
  });
};
module.exports = {
  Register,
  getUser,
  Login,
  Logout,
  ResendOTP,
  VerifikasiOTP,
  editUser,
  uploadImg,
  getUserDetail,
  changePassword,
  resetPassword,
  newResetPassword,
};
