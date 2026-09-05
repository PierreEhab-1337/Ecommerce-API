import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js"; 
import userController from "../controllers/user.controller.js";
import  {addUserValidation, getUserValidation}  from "../validators/user.validation.js";

const router = express.Router();

router.post('/add',authMiddleware ,checkRole('admin'), addUserValidation, asyncHandler(userController.AddUser));
router.get('/all',authMiddleware ,checkRole('admin') , asyncHandler(userController.GetAllUser));
router.get('/:id',authMiddleware ,checkRole('admin'),getUserValidation, asyncHandler(userController.GetUserById));

export default router;