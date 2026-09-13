import express from "express";
import { getCart, addItemToCart } from "../controllers/cart.controller.js";
import validate from "../middleware/validateHandler.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { addItemSchema } from "../validators/cart.validation.js";

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getCart));
router.post("/items", authMiddleware, validate(addItemSchema), asyncHandler(addItemToCart));

export default router;