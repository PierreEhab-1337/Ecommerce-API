import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getActiveProduct,
  getProductById,
  addReview,
  getProductReviews,
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


router.post(
  "/:id/reviews",
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
