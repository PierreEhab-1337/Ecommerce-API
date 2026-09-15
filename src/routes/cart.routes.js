import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  postCartsCoupon,
  deleteCartsCoupon,
} from "../controllers/cart.controller.js";


const router = express.Router();

router.post(
    "/coupon",
    // authMiddleware,
    asyncHandler(postCartsCoupon)
);

router.delete(
    "/coupon",
    // authMiddleware,
    asyncHandler(deleteCartsCoupon)
);


export default router