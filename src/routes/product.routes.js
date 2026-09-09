
import express from "express";
import asyncHandler from "../utils/asyncHandler.js"

import productController from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", productController.searchProducts);
router.delete("/:id/reviews/:rid", protect, productController.deleteReview);

export default router;