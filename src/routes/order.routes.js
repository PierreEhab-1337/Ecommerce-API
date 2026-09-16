import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import { getMyOrders } from "../controllers/order.controller.js";
import { getMyOrdersSchema } from "../validators/order.validation.js";

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  validate(getMyOrdersSchema, "query"),
  getMyOrders
);

export default router;


