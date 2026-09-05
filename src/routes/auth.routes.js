import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getProfile, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, asyncHandler(getProfile));
router.post("/logout", protect, asyncHandler(logout));

export default router;