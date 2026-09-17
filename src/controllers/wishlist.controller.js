import Wishlist from "../models/Wishlist.model.js"
import User from "../models/User.model.js";
import createError from "../utils/createError.js"
import Product from "../models/Product.model.js"
export const clearWishlist = async (req, res, next) => {
  const userId = req.user.userId;

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return next(createError("Wishlist not found", 404));
  }

  wishlist.products = [];
  await wishlist.save();

  await User.findByIdAndUpdate(userId, {
    $set: { wishlist: [] },
  });

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    data: wishlist,
  });
};
