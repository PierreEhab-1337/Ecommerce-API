import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/my", authMiddleware, asyncHandler(getWishlist));
router.post("/add/:productId", authMiddleware, asyncHandler(addToWishlist));
router.delete("/remove/:productId", authMiddleware, asyncHandler(removeFromWishlist));
export default router;  