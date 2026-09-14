import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.delete("/clear", authMiddleware, clearCart);

export default router;