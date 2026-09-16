import Wishlist from "../models/Wishlist.model.js";
import createError from "../utils/createError.js";

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