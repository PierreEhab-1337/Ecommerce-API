import express from 'express';
import { login, forgetPasswordSendOTP, forgetPasswordVerifyOTP } from '../controllers/auth.controller.js';
import validate from '../middleware/validateHandler.middleware.js';
import { loginSchema, forgetPasswordSchema, verifyOTPSchema } from '../validators/auth.validation.js';
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(login));

router.post('/forgot-password/send-otp', validate(forgetPasswordSchema),asyncHandler(forgetPasswordSendOTP));
router.post('/forgot-password/verify-otp',validate(verifyOTPSchema),
asyncHandler(forgetPasswordVerifyOTP)
);

export default router;
