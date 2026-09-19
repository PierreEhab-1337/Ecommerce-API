import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validateHandler.middleware.js";

import {
  getDashboardStats,
  getAllCarts,
  getAllWishlists,
  getWishlistStats
} from "../controllers/admin.controller.js";

import {
  getAllWishlistSchema,
} from "../validators/wishlist.validation.js"

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

router.get(
    "/wishlists/all",
    authMiddleware,
    checkRole("admin"),
    validate(getAllWishlistSchema, "query"),
    asyncHandler(getAllWishlists)
);

router.get(
    "/wishlists/stats",
    authMiddleware,
    checkRole("admin"),
    asyncHandler(getWishlistStats)
);



export default router;