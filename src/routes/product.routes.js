
import express from "express";
import * as productController from "../controllers/product.controller.js";import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  getProductByIdSchema,
  getProductsQuerySchema,
} from "../validators/product.validation.js";
const router = express.Router();
router.get("/search", productController.searchProducts);
router.delete("/:id/reviews/:rid", protect, productController.deleteReview);
import {
  getActiveProduct,
  getProductById,
} from "../controllers/product.controller.js";



router.get(
  "/",
  validate(getProductsQuerySchema, "query"),
  productController.getActiveProduct
);

router.get(
  "/:id",
  validate(getProductByIdSchema, "params"),
  productController.getProductById
);


export default router;
