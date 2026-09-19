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
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from "../controllers/order.controller.js";

import {
  getMyOrdersSchema,
  orderIdSchema,
  updateOrderStatusSchema
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

router.get(
  '/my/:id',
  authMiddleware,
  validate(orderIdSchema, 'params'),
  asyncHandler(GetMyOrderById)
);

router.patch(
  '/my/:id/cancel',
  authMiddleware,
  validate(orderIdSchema, 'params'),
  asyncHandler(CancelMyOrder)
);


router.get(
  "/admin", 
  authMiddleware, 
  checkRole("admin"),
  validate(getMyOrdersSchema, "query"), 
  asyncHandler(getAllOrdersAdmin)
);

router.get(
  "/admin/:id",
  authMiddleware,
  checkRole("admin"),
  validate(orderIdSchema, 'params'),
  asyncHandler(getAdminOrderById)
);

router.patch(
  "/admin/:id/status", 
  authMiddleware, 
  checkRole("admin"),
  validate(orderIdSchema, "params"), 
  validate(updateOrderStatusSchema),
  asyncHandler(updateOrderStatusAdmin)
);

export default router;