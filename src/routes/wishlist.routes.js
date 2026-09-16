import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import {
    getAllWishlists,
    getWishlistStats
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    checkRole("admin"),
    asyncHandler(getAllWishlists)
);

router.get(
    "/stats",
    authMiddleware,
    checkRole("admin"),
    asyncHandler(getWishlistStats)
);

export default router;