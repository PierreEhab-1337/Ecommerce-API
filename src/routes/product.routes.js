import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getActiveProduct,
  getProductById,
} from "../controllers/product.controller.js";
import {
  getProductByIdSchema,
  getProductsQuerySchema,
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

export default router;
