import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  getDashboardStats,
  getAllCarts,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  checkRole("admin"),
  asyncHandler(getDashboardStats),
);

router.get(
  "/carts",
  authMiddleware,
  checkRole("admin"),
  asyncHandler(getAllCarts),
);

export default router;