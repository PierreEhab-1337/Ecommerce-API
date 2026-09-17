import express from "express"

const router = express.Router()
import authMiddleware from "../middleware/auth.middleware.js"
import { checkRole } from "../middleware/checkRole.middleware.js"
import validateOrderId from  "../validators/order.validation.js"
import asyncHandler from "../utils/asyncHandler.js"

import {
  getAdminOrderById
} from "../controllers/order.controller.js"



router.get(
  "/admin/:id",
  authMiddleware,
  checkRole("admin"),
  validateOrderId,
  asyncHandler(getAdminOrderById)
)

export default router