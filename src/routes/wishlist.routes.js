import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get(
  "/my", 
  authMiddleware, 
  asyncHandler(getWishlist)
);

router.post(
  "/add/:productId", 
  authMiddleware, 
  asyncHandler(addToWishlist)
);

router.delete(
  "/remove/:productId", 
  authMiddleware, 
  asyncHandler(removeFromWishlist)
);

router.delete(
  "/clear",
  authMiddleware,
  asyncHandler(clearWishlist)
); 

export default router;  
