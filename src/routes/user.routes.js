import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 
import { checkRole } from "../middlewares/checkRole.middleware.js"; 
import userController from "../controllers/user.controller.js";
import { createUserSchema, idParamSchema } from "../validators/user.validation.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post('/add', authMiddleware, checkRole('admin'), validate(createUserSchema, 'body'), asyncHandler(userController.AddUser));
router.get('/all', authMiddleware, checkRole('admin'), asyncHandler(userController.GetAllUser));
router.get('/:id', authMiddleware, checkRole('admin'), validate(idParamSchema, 'params'), asyncHandler(userController.GetUserById));

export default router;