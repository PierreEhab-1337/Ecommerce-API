import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validateHandler.middleware.js';
import { loginSchema } from '../validation/auth.validation.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;