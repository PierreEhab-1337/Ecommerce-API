import express from "express";

import { stripeWebhook } from "../controllers/Stripe.Webhook.Controller";

const router = express.Router();

// ----------------------------------- Stripe Webhook -----------------------------------

router.post("/", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
