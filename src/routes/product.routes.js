import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getActiveProduct,
  getProductById,
  searchProducts,
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/product.controller.js";
import {
  getProductByIdSchema,
  getProductsQuerySchema,
  addReviewSchema,
} from "../validators/product.validation.js";
import validate from "../middleware/validateHandler.middleware.js";

const router = express.Router();

router.get(
  "/:id",
  validate(getProductByIdSchema, "params"),
  asyncHandler(getProductById),
);

router.get(
  "/",
  validate(getProductsQuerySchema, "query"),
  asyncHandler(getActiveProduct),
);

router.get(
  "/search", 
  asyncHandler(searchProducts)
);

router.delete(
  "/:id/reviews/:rid", 
  authMiddleware, 
  asyncHandler(deleteReview)
);

router.post(
  "/:id/reviews",
  authMiddleware,
  validate(getProductByIdSchema, "params"),
  validate(addReviewSchema, "body"),
  asyncHandler(addReview),
);

router.get(
  "/:id/reviews",
  validate(getProductByIdSchema, "params"),
  asyncHandler(getProductReviews),
);

export default router;
