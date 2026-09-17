import Order from "../models/Order.model.js"
import createError from "../utils/createError.js"



export const getAdminOrderById = async (req, res, next) => {
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
};