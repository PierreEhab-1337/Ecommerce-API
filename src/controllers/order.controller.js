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

    // ----------------------------------- Validate Payment Method -----------------------------------

    if (!["cash", "stripe"].includes(paymentMethod)) {
      throw createError(`Payment method "${paymentMethod}" not supported`, 400);
    }

    // ----------------------------------- Validate Shipping Address -----------------------------------

    if (!shippingAddress) {
      throw createError("Shipping address is required", 400);
    }

    // ----------------------------------- Fetch User -----------------------------------

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw createError("User not found", 404);
    }

    // ------------------- Validate if Address was previously Added to User  ------------------

    const addressExists = user.addresses.some((userAddress) => (
      userAddress.fullName === shippingAddress.fullName && 
      userAddress.phone === shippingAddress.phone && 
      userAddress.country === shippingAddress.country && 
      userAddress.city === shippingAddress.city && 
      userAddress.address === shippingAddress.address && 
      userAddress.postalCode === shippingAddress.postalCode
    ))

    // -------------------- Add Shipping Address to User if It didn't Exist ------------

    if(!addressExists){
      user.addresses.push(shippingAddress);
      await user.save({ session });
    }
    
    // const selectedAddress = user.addresses[user.addresses.length - 1];

    // ----------------------------------- Fetch the Cart -----------------------------------

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product", "name images price discountPrice stock")
      .session(session);

    // ----------------------------------- Check if Cart is Empty -----------------------------------

    if (!cart || cart.items.length === 0) {
      throw createError("Cart is empty", 400);
    }

    // ----------------------------------- Validate Products and Stock -----------------------------------

    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        throw createError("One or more products no longer exist", 404);
      }

      if (product.stock < cartItem.quantity) {
        throw createError(
          `Product "${product.name}" does not have enough stock`,
          400,
        );
      }

      // ----------------------------------- Prepare Order Items -----------------------------------

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.discountPrice > 0 ? product.discountPrice : product.price ,
        quantity: cartItem.quantity,
      });
    }

    // ----------------------------------- Get Cart Discount -----------------------------------

    const discountAmount = cart.discountAmount || 0;

    // ----------------------------------- Create Order -----------------------------------

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,

          // shippingAddress: selectedAddress.toObject(),
          shippingAddress,

          paymentMethod,
          paymentStatus: "pending",
          discount: discountAmount,
          customerNote,
        },
      ],
      { session },
    );

    // ----------------------------------- Update Product Stock -----------------------------------

    for(const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        { $inc: { stock: -cartItem.quantity } },
        { session },
      );
    }

    // ----------------------------------- Clear the Cart -----------------------------------

    cart.items = [];
    cart.coupon = undefined;

    await cart.save({ session });

    // ----------------------------------- Handle Cash Payment -----------------------------------

    if (paymentMethod === "cash") {
      order.paymentStatus = "pending";
      order.status = "confirmed";

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      // ----------------------------------- Send Order Confirmation Email -----------------------------------

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

      await sendEmail({
        to: user.email,
        subject: "Order Created - KODA STORE",
        text: `Your order ${order._id} has been created. Please complete your payment.`,
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

export const getMyOrders = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    user: req.user.id,
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if(orders.length === 0)
    throw createError("No Orders Found!", 404);

  const totalOrders = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: {
      orders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    },
  });
};
