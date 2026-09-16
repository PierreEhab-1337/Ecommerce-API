import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { clearWishlist  } from "../controllers/wishlist.controller.js";

const router = express.Router();


router.delete(
  "/clear",
  authMiddleware,
  clearWishlist
);

export default router;