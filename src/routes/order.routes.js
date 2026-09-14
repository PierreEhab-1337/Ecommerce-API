import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/my", authMiddleware, getMyOrders);

export default router;