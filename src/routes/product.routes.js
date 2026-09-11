import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import {createProduct} from "../controllers/product.controller.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import createProductValidation from "../validators/product.validation.js"
import upload from "../middleware/uploadHandler.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkRole("admin"),
  upload.array("image"),
  createProductValidation,
  asyncHandler(createProduct)
);

export default router;