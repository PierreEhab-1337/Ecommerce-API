import Order from "../models/Order.model.js";

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