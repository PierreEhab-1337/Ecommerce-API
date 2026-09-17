import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import validate from "../middleware/validateHandler.middleware.js"

import { 
    getWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    clearWishlist,
    getAllWishlists,
    getWishlistStats 
} from "../controllers/wishlist.controller.js";

import {
  getAllWishlistSchema,
  wishlistIdSchema,
} from "../validators/wishlist.validation.js"

const router = express.Router();

router.get(
  "/my", 
  authMiddleware, 
  asyncHandler(getWishlist)
);

router.post(
  "/add/:productId", 
  authMiddleware, 
  validate(wishlistIdSchema, "params"),
  asyncHandler(addToWishlist),
);

router.delete(
  "/remove/:productId", 
  authMiddleware, 
  validate(wishlistIdSchema, "params"),
  asyncHandler(removeFromWishlist),
);

router.delete(
  "/clear",
  authMiddleware,
  asyncHandler(clearWishlist)
); 

router.get(
    "/admin/all",
    authMiddleware,
    checkRole("admin"),
    validate(getAllWishlistSchema, "query"),
    asyncHandler(getAllWishlists)
);

router.get(
    "/admin/stats",
    authMiddleware,
    checkRole("admin"),
    asyncHandler(getWishlistStats)
);

export default router;  
