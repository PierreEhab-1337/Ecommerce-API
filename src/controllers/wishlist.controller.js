import Wishlist from "../models/Wishlist.model.js";
import createError from "../utils/createError.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

export const getWishlist= async (req, res)=>{
    const userId= req.user.id;
    const wishlist =await Wishlist.findOne({user: userId});
    if(!wishlist)
    {
        throw createError("Wishlist not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        data: wishlist,
    });
}

export const addToWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const product = await Product.findById(productId);

    const user = await User.findOne({_id: userId});

    if(!user)
        throw createError("User not found", 404);

    if (!product) {
        throw createError("Product not found", 404);
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        await Wishlist.create({
            user: userId,
            products: [productId]
        });

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });
    }

    if (wishlist.products.some((id) => id.equals(productId))) {
        throw createError("Product already in wishlist", 400);
    }

    wishlist.products.push(productId);
    await (await wishlist.save()).populate("products");

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        data: wishlist,
    });
};

export const removeFromWishlist = async (req, res) => {
    const userId= req.user.id;
    const {productId}= req.params;

    const user = await User.findOne({_id: userId});

    if(!user)
        throw createError("User not found", 404);

    const wishlist = await Wishlist.findOne({ user: userId });
    if(!wishlist)
    {
        throw createError("Wishlist not found", 404);
    }

    if (!wishlist.products.some((id) => id.equals(productId))) {
        throw createError("Product not in wishlist", 400);
    }
    
    wishlist.products.remove(productId);
    await wishlist.save();

    user.wishlist = user.wishlist.filter((id) => (
        !id.equals(productId)
    ));
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        data: wishlist,
    });
}

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
