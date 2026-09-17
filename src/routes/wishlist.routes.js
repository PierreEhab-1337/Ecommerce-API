import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { clearWishlist  } from "../controllers/wishlist.controller.js"
import asyncHandler from "../utils/asyncHandler.js" 
const router = express.Router()



router.delete(
  "/clear",
  authMiddleware,
  asyncHandler(clearWishlist)
) 

export default router