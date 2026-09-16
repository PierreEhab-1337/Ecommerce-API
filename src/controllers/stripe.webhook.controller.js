import Stripe from "stripe";
import Order from "../models/Order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (req, res) => {
    
// ----------------------------------- Verify Stripe Webhook --------------------------

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

// ----------------------------------- Handle Stripe Events --------------------------

  switch (event.type) {
// ----------------------------------- Payment Succeeded -----------------------------

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

// ----------------------------------- Find Order ------------------------------------

      const order = await Order.findOne({
        transactionId: paymentIntent.id,
      });

      if (!order) {
        console.log(`Order not found for PaymentIntent: ${paymentIntent.id}`);

        return res.status(200).json({
          success: true,
          message: "Webhook received, but order was not found",
          data: {
            received: true,
          },
        });
      }

// ----------------------------------- Update Payment Status -------------------------

      order.paymentStatus = "paid";
      order.paidAt = new Date();

      await order.save();

      console.log(`Order ${order._id} payment status updated to paid`);

      break;
    }

// ----------------------------------- Payment Failed ----------------------------------

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

// ----------------------------------- Find Order ------------------------------------

      const order = await Order.findOne({
        transactionId: paymentIntent.id,
      });

      if (!order) {
        return res.status(200).json({
          success: true,
          message: "Webhook received, but order was not found",
          data: {
            received: true,
          },
        });
      }

// ----------------------------------- Update Payment Status -------------------------

      order.paymentStatus = "failed";

      await order.save();

      console.log(`Order ${order._id} payment failed`);

      break;
    }

// ----------------------------------- Payment Canceled ------------------------------

    case "payment_intent.canceled": {
      const paymentIntent = event.data.object;

// ----------------------------------- Find Order ------------------------------------

      const order = await Order.findOne({
        transactionId: paymentIntent.id,
      });

      if (!order) {
        return res.status(200).json({
          success: true,
          message: "Webhook received, but order was not found",
          data: {
            received: true,
          },
        });
      }

// ----------------------------------- Update Payment Status --------------------------

      order.paymentStatus = "failed";

      await order.save();

      console.log(`Order ${order._id} payment canceled`);

      break;
    }

// ----------------------------------- Unknown Event -----------------------------------

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

// ----------------------------------- Send Response -----------------------------------

  return res.status(200).json({
    success: true,
    message: "Stripe webhook received successfully",
    data: {
      received: true,
    },
  });
};
