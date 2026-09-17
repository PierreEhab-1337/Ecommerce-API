import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import orderController from "../controllers/order.controller.js";
import validate from "../middleware/validateHandler.middleware.js";
import { idParamSchema } from "../validators/user.validation.js";

const router = express.Router();

router.get('/my/:id', authMiddleware, validate(idParamSchema, 'params'), asyncHandler(orderController.GetMyOrderById));

router.patch('/my/:id/cancel', authMiddleware, validate(idParamSchema, 'params'), asyncHandler(orderController.CancelMyOrder));

export default router;