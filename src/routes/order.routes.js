import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

import { 
  createOrder,
  getMyOrders,
  GetMyOrderById,
  CancelMyOrder,
  getAdminOrderById,
} from "../controllers/order.controller.js";

import { 
  getMyOrdersSchema,
  orderIdSchema,
} from "../validators/order.validation.js";

import { idParamSchema } from "../validators/user.validation.js";

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

router.get(
  '/my/:id', 
  authMiddleware, 
  validate(idParamSchema, 'params'), 
  asyncHandler(GetMyOrderById)
);

router.patch(
  '/my/:id/cancel', 
  authMiddleware, 
  validate(idParamSchema, 'params'), 
  asyncHandler(CancelMyOrder)
);

router.get(
  "/admin/:id",
  authMiddleware,
  checkRole("admin"),
  validate(orderIdSchema, 'params'),
  asyncHandler(getAdminOrderById)
)

export default router;


