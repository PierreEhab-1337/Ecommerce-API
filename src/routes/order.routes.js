import express from "express";

import { createOrder } from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", authMiddleware, asyncHandler(createOrder));

export default router;
