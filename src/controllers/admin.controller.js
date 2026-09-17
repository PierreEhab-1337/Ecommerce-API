import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export const getDashboardStats = async (req, res) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalRevenueResult,
    monthlyRevenueResult,
    lastMonthRevenueResult,
    orderCountsRaw,
    topProducts,
    dailyStats,
    recentOrders,
    totalCustomers,
  ] = await Promise.all([
    
    Order.aggregate([
      { $match: { status: { $nin: ["pending", "cancelled"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Order.aggregate([
      {
        $match: {
          status: { $nin: ["pending", "cancelled"] },
          createdAt: { $gte: startOfThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Order.aggregate([
      {
        $match: {
          status: { $nin: ["pending", "cancelled"] },
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]),

    Order.aggregate([
     {
        $match: {
         paymentStatus: "paid",
         createdAt: { $gte: sevenDaysAgo },
        },
     },
     {
        $group: {
         _id: {
             $dateToString: {
                 format: "%Y-%m-%d",
                 date: "$createdAt",
                },
            },
         revenue: { $sum: "$totalPrice" },
         orderCount: { $sum: 1 },
        },
     },
     { $sort: { _id: 1 } },
    ]),

    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username email"),

    User.countDocuments({ role: "customer" }),
  ]);
  
  const orderCounts = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  orderCountsRaw.forEach((item) => {
    orderCounts[item._id] = item.count;
  });

  const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;
  const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

  const growthPercentage =
    lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : monthlyRevenue > 0
        ? 100
        : 0;

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      revenue: {
        total: totalRevenueResult[0]?.total || 0,
        monthly: monthlyRevenue,
        lastMonth: lastMonthRevenue,
        growthPercentage: Number(growthPercentage.toFixed(2)),
      },
      orderCounts,
      topProducts,
      last7Days: dailyStats,
      recentOrders,
      totalCustomers,
    },
  });
};

export const getAllCarts = async (req, res) => {
  const carts = await Cart.find({ "items.0": { $exists: true } })
    .populate("user", "username email phone")
    .populate("items.product", "name price discountPrice images stock");

  res.status(200).json({
    success: true,
    message: "Active carts fetched successfully",
    data: carts,
  });
};