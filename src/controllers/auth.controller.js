import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import createError from '../utils/createError.js';
import crypto from "crypto";
import OTP from "../models/OTP.model.js";
import sendEmail from '../utils/sendEmail.js';
import bcryptjs from "bcryptjs";


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const { password: _, ...userData } = user.toObject();

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user: userData },
  });
};

//task3
export const forgetPasswordSendOTP=async(req, res)=>{
const { email}= req.body;
const user= await User.findOne({email});

if(!user){
  throw createError('User not found', 404);
}
const otp = crypto.randomInt(100000, 1000000).toString();

const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

await OTP.create({
  email,
  otp,
  expiresAt,
  userData: {
    username: user.username,
    email: user.email
  },
});
await sendEmail({
  to: email,
  subject: "Password reset OTP",
  text: `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`,
  OTPNumber: otp,
});
res.status(200).json({
  success: true,
  message: "OTP sent correctly",
});
};



export const forgetPasswordVerifyOTP= async(req, res)=>{
  const {email, otp, newPassword}= req.body;
  
  const OTPRecord= await OTP.findOne({email}).sort({createdAt: -1});

  if(!OTPRecord){
    throw createError('Invalid OTP', 400);
  }
  if(OTPRecord.expiresAt< Date.now()){
    throw createError('OTP has expired', 400);
  }
 const isValidOTP = await bcryptjs.compare(otp, OTPRecord.otp);
 if(!isValidOTP){
  throw createError('Invalid OTP', 400);
 }
 const user= await User.findOne({email});
 if(!user){
  throw createError('User not found', 404);
 }

 user.password = newPassword;
 await user.save();

 await OTP.findByIdAndDelete(OTPRecord._id);
 res.status(200).json({
    success: true,
    message: "Password reset successfully",
 
  })
};
////
