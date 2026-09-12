import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import createError from '../utils/createError.js';
import crypto from "crypto";
import OTP from '../models/OTP.model.js';
import sendEmail from '../utils/sendEmail.js';
import bcryptjs from "bcryptjs";


export const register = async (req, res) => {
  const data = req.body;
  data.email = data.email.toLowerCase().trim()

  // 1. التحقق من وجود الإيميل مسبقاً
  const duplicatedEmail = await User.findOne({ email: data.email })
  if (duplicatedEmail) {
    return res.status(400).json({ message: "Email is already taken" })
  }

  // 2. توليد رمز OTP وتحديد وقت انتهائه ( دقيقة)
  const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6 أرقام
  const otpExpires = new Date(Date.now() + 2 * 60 * 1000)

  const user = new User({
    ...data,
    isVerified: false,
    otp,
    otpExpires,
  })

  await user.save()

  // 4. إرسال الإيميل للمستخدم
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email - OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 1 minutes.`,
    otp: otp

  })

  res.status(201).json({
    message: "Registration successful. Please check your email for the OTP code.",
    email: user.email,
  })
}



export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(createError("Email and OTP code are required", 400));
  }

  const cleanEmail = email.toLowerCase().trim();
  // تحويل الـ otp الممرر إلى نص وحذف أي مسافات
  const inputOtp = String(otp).trim(); 
  //console.log("OTP from Request Body:", inputOtp, typeof inputOtp);

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    return next(createError("User not found", 404));
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account is already verified" });
  }

  // تحويل الـ otp المخزن في قاعدة البيانات إلى نص أيضاً
  const storedOtp = String(user.otp).trim();

  //console.log("OTP from Database    :", storedOtp, typeof storedOtp);
  

  // المقارنة بعد التأكد من أن الطرفين عبارة عن String
  if (storedOtp !== inputOtp) {
    return next(createError("Invalid OTP code", 400));
  }

  if (new Date() > user.otpExpires) {
    return next(createError("OTP code has expired. Please request a new one", 400));
  }

  // تفعيل الحساب
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.status(200).json({
    message: "Email verified successfully. You can now login.",
  });
};





export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user.isVerified) {
    return next(createError("Please verify your email first.", 400));
  }
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
export const forgetPasswordSendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
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



export const forgetPasswordVerifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const OTPRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (!OTPRecord) {
    throw createError('Invalid OTP', 400);
  }
  if (OTPRecord.expiresAt < Date.now()) {
    throw createError('OTP has expired', 400);
  }
  const isValidOTP = await bcryptjs.compare(otp, OTPRecord.otp);
  if (!isValidOTP) {
    throw createError('Invalid OTP', 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
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

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw createError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
};

export const logout = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
