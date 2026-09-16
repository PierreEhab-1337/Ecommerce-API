import Order from "../models/Order.model.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      customerNote,
    } = req.body;

    if (!items || items.length === 0) {
      return next(createError("Order must contain at least one item", 400));
    }

    const order = await Order.create({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      customerNote,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email");

    if (!order) {
      return next(createError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};