import express from "express";
import asyncHandler from "../utils/asyncHandler.js";

import { stripeWebhook } from "../controllers/stripe.webhook.controller.js";

const router = express.Router();

// ----------------------------------- Stripe Webhook -----------------------------------

router.post("/", express.raw({ type: "application/json" }), asyncHandler(stripeWebhook));

export default router;
