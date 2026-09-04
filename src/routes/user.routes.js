import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { auth, allowedTo } from "../middlewares/auth.middleware.js"; 
import userController from "../controllers/user.controller.js";
import  {addUserValidation, getUserValidation}  from "../validators/user.validation.js";

const router = express.Router();

router.post('/add',auth, allowedTo('admin'), addUserValidation, asyncHandler(userController.AddUser));
router.get('/all', auth, allowedTo('admin'), asyncHandler(userController.GetAllUser));
router.get('/:id', getUserValidation, asyncHandler(userController.GetUserById));

export default router;