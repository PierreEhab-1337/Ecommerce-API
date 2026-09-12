import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getActiveProduct,
  getProductById,
  searchProducts,
  createProduct,
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/product.controller.js";
import {
  getProductByIdSchema,
  getProductsQuerySchema,
  addReviewSchema,
  createProductSchema
} from "../validators/product.validation.js";
import validate from "../middleware/validateHandler.middleware.js";
import upload from "../middleware/uploadHandler.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

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

router.post(
  "/",
  authMiddleware,
  checkRole("admin"),
  upload.array("image"),
  validate(createProductSchema),
  asyncHandler(createProduct)
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
