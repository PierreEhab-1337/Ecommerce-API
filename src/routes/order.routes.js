import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import { 
  createOrder,
  getMyOrders 
} from "../controllers/order.controller.js";

import { 
  getMyOrdersSchema,
} from "../validators/order.validation.js";

const router = express.Router();

router.post(
  "/", 
  authMiddleware, 
  asyncHandler(createOrder)
);

router.get(
  "/my",
  authMiddleware,
  validate(getMyOrdersSchema, "query"),
  asyncHandler(getMyOrders),
);

export default router;


