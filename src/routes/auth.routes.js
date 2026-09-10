import express from 'express';
import authMiddleware from "../middleware/auth.middleware.js";
import { login, forgetPasswordSendOTP, forgetPasswordVerifyOTP,  getProfile, logout } from '../controllers/auth.controller.js';
import validate from '../middleware/validateHandler.middleware.js';
import { loginSchema, forgetPasswordSchema, verifyOTPSchema } from '../validators/auth.validation.js';
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(login));

router.post('/forgot-password/send-otp', validate(forgetPasswordSchema), asyncHandler(forgetPasswordSendOTP));
router.post('/forgot-password/verify-otp', validate(verifyOTPSchema), asyncHandler(forgetPasswordVerifyOTP));

router.get("/me", authMiddleware, asyncHandler(getProfile));
router.post("/logout", authMiddleware, asyncHandler(logout));

export default router;
