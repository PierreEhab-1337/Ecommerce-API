import Wishlist from "../models/Wishlist.model.js"
import createError from "../utils/createError.js"
import Product from "../models/Product.model.js"
export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ 
      user: req.user.userId 
    })
    if (!wishlist) {
      return next(createError("Wishlist not found", 404))
    }
    wishlist.products = []
    await wishlist.save()
    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: wishlist
    })
  } catch (error) {
    next(error)
  }
}

