import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import Wishlist from "../models/Wishlist.model.js";
import createError from "../utils/createError.js";

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
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),


    Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startOfThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
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
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalPrice", 0],
            },
          },
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

export const getAllWishlists = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const [wishlists, total] = await Promise.all([
        Wishlist.find().skip(skip).limit(limit),
        Wishlist.countDocuments()
    ]);

    if (wishlists.length === 0) {
        throw createError("No wishlists found", 404);

    }

    res.status(200).json({
        success: true,
        message: "Wishlists retrieved successfully",
        data: {
            wishlists,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)

            }
        }
    });
};


export const getWishlistStats = async (req, res) => {
    const stats = await Wishlist.aggregate([
        {
            $unwind: "$products"
        },
        {
            $group: {
                _id: "$products",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit:10
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as:"product"
            }
        },
        {
            $unwind:"$product"
        },
        {
            $project: {
                _id: 0,
                product: 1,
                wishlistCount: "$count"
            }
        }
    ]);

    res.status(200).json({
        success: true,
        message: "Wishlist stats retrieved successfully",
        data: stats
    });

};