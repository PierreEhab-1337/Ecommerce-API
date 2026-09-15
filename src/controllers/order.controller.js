import mongoose from "mongoose";
import Stripe from "stripe";

import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import User from "../models/User.model.js";

import createError from "../utils/createError.js";
import sendEmail, { orderEmailTemplate } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  // ----------------------------------- Start Transaction -----------------------------------

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ----------------------------------- Get Order Data -----------------------------------

    const { shippingAddress, paymentMethod = "cash", customerNote } = req.body;

    const userId = req.user.id;

    // ----------------------------------- Fetch the Cart -----------------------------------

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product", "name images price stock")
      .session(session);

    // ----------------------------------- Check if Cart is Empty -----------------------------------

    if (!cart || cart.items.length === 0) {
      throw createError("Cart is empty", 400);
    }

    const orderItems = [];

    // ----------------------------------- Validate Products and Stock -----------------------------------

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        throw createError("One or more products no longer exist", 404);
      }

      if (product.stock < cartItem.quantity) {
        throw createError(
          `Not enough stock for "${product.name}". Available: ${product.stock}`,
          400,
        );
      }

      // ----------------------------------- Prepare Order Items -----------------------------------

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.price,
        quantity: cartItem.quantity,
      });
    }

    // ----------------------------------- Create Order -----------------------------------

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          customerNote,
        },
      ],
      { session },
    );

    // ----------------------------------- Update Product Stock -----------------------------------

    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        { $inc: { stock: -cartItem.quantity } },
        { session },
      );
    }

    // ----------------------------------- Clear the Cart -----------------------------------

    cart.items = [];
    await cart.save({ session });

    // ----------------------------------- Handle Cash Payment -----------------------------------

    if (paymentMethod === "cash") {
      await session.commitTransaction();
      session.endSession();

      // ----------------------------------- Send Order Confirmation Email -----------------------------------

      const user = await User.findById(userId);

      await sendEmail({
        to: user.email,
        subject: "Order Confirmation - KODA STORE",
        text: `Your order ${order._id} has been placed successfully.`,
        html: orderEmailTemplate(order),
      });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    }

    // ----------------------------------- Handle Stripe Payment -----------------------------------

    if (paymentMethod === "stripe") {
      // ----------------------------------- Create Stripe PaymentIntent -----------------------------------

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: "egp",
        metadata: {
          orderId: order._id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // ----------------------------------- Save Stripe Transaction ID -----------------------------------

      order.transactionId = paymentIntent.id;

      await order.save({ session });

      // ----------------------------------- Commit Transaction -----------------------------------

      await session.commitTransaction();
      session.endSession();

      // ----------------------------------- Send Order Confirmation Email -----------------------------------

      const user = await User.findById(userId);

      await sendEmail({
        to: user.email,
        subject: "Order Confirmation - KODA STORE",
        text: `Your order ${order._id} has been created successfully.`,
        html: orderEmailTemplate(order),
      });

      return res.status(201).json({
        success: true,
        message: "Order created — complete payment",
        data: {
          order,
          clientSecret: paymentIntent.client_secret,
        },
      });
    }

    // ----------------------------------- Unsupported Payment Method -----------------------------------

    throw createError(`Payment method "${paymentMethod}" not supported`, 400);
  } catch (error) {
    // ----------------------------------- Rollback Transaction -----------------------------------

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // ----------------------------------- End Session -----------------------------------

    session.endSession();

    throw error;
  }
};
