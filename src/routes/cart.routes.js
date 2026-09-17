import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import {
  addItemSchema,
  updateCartItemSchema,
  removeCartItemParamSchema,
} from "../validators/cart.validation.js";
import {
  getCart, 
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  postCartsCoupon,
  deleteCartsCoupon,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get(
  "/", 
  authMiddleware, 
  asyncHandler(getCart)
);

router.post(
  "/items", 
  authMiddleware, 
  validate(addItemSchema), 
  asyncHandler(addItemToCart)
);

router.patch(
  "/items", 
  authMiddleware, 
  validate(updateCartItemSchema, "body"), 
  asyncHandler(updateCartItemQuantity)
);

router.delete(
  "/items/:productId", 
  authMiddleware, 
  validate(removeCartItemParamSchema, "params"), 
  asyncHandler(removeCartItem)
);

router.delete(
  "/clear", 
  authMiddleware, 
  asyncHandler(clearCart)
);

router.post(
  "/coupon",
  authMiddleware,
  asyncHandler(postCartsCoupon)
);

router.delete(
  "/coupon",
  authMiddleware,
  asyncHandler(deleteCartsCoupon)
);

export default router;
