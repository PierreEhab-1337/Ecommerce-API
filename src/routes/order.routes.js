import express from "express";

const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

import {
  getAdminOrderById
} from "../controllers/order.controller.js";



router.get(
  "/admin/:id",
  authMiddleware,
  checkRole("admin"),
  getAdminOrderById
);

export default router;