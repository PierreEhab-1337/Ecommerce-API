import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import {
  updateCartItemSchema,
  removeCartItemParamSchema,
} from "../validators/cart.validation.js";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.patch("/items", authMiddleware, validate(updateCartItemSchema, "body"), asyncHandler(updateCartItemQuantity));

router.delete("/items/:productId", authMiddleware, validate(removeCartItemParamSchema, "params"), asyncHandler(removeCartItem));

export default router;
