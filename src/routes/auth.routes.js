import express from 'express';
import { login } from '../controllers/auth.controller.js';
import validate from '../middleware/validateHandler.middleware.js';
import { loginSchema } from '../validators/auth.validation.js';
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(login));

export default router;
