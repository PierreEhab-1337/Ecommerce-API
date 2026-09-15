import Cart from "../models/Cart.model.js";
import createError from "../utils/createError.js";

export const Coupons = {
  SAVE10: {
    discountType: "percentage",
    discountValue: 10,
  },
  SAVE20: {
    discountType: "percentage",
    discountValue: 20,
  },
  SAVE50: {
    discountType: "percentage",
    discountValue: 50,
  },
  SAVE80: {
    discountType: "percentage",
    discountValue: 80,
  },
  OFF50: {
    discountType: "fixed",
    discountValue: 50,
  },
};

// post cart coupon

export const postCartsCoupon = async (req, res) => {
  const { code, userId } = req.body;
  //   const userId = req.user.id;

  if (!userId) {
    throw createError("userId is required", 400);
  }

  if (!code || !Coupons[code]) {
    throw createError("This code is invalid or expired !!", 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw createError("Cart not found", 404);
  }

  const coupon = Coupons[code];
  cart.coupon = {
    code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  };

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon is applied successfully",
    data: { cart },
  });
};

// delete cart coupon

export const deleteCartsCoupon = async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    throw createError("userId is required", 400);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw createError("Cart not found", 404);
  }

  cart.coupon = undefined;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon is deleted successfully",
    data: { cart },
  });
};
