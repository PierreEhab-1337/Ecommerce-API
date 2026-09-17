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
} from "../controllers/wishlist.controller.js";

import {
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

export default router;  
