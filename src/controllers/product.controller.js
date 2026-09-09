import Product from "../models/Product.model.js";
import createError from "../utils/createError.js";

const searchProducts = async (req, res, next) => {
  try {
    const {
      text,
      category,
      subcategory,
      brand,
      tags,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;
    let query = { isActive: true };
    if (text) {
      query.$text = { $search: text };
    }
    if (category) {
      query.category = category.toLowerCase();
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (brand) {
      query.brand = brand;
    }
    if (tags) {
      const tagsArray = tags.split(",");
      query.tags = { $in: tagsArray };
    }
    // if (minPrice) {
    //   query.price = {}
    //   query.price.$gte=Number(minPrice)
    // }
    // if (maxPrice) {
    //   query.price = {}
    //   query.price.$lte=Number(maxPrice)
    // }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sorting = "-createdAt"; //تنازلي
    if (sort) {
      sorting = sort.split(",").join(" "); //mongoose هشيل ال ',' واحط مسافه
    }

    // Pagination part
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit)); 
    const skip = (pageNum - 1) * limitNum;    //1:1-10  2:11-20   p1==>p2 ((2-1)*10)=10 skip 10product

    const products = await Product.find(query)
      .sort(sorting)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Products Searching is done successfully",
      result: products.length,
      pagination: {
        total: totalProducts,
        page: pageNum,
        allPages: Math.ceil(totalProducts / limitNum),
      },
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// /////////////////////////////////////////////////////

const deleteReview = async (req, res, next) => {
  try {
    const { id, rid } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw createError("The Product is not found!!", 404);
    }

    const review = product.reviews.id(rid);
    if (!review) {
      throw createError("The review is not found!!", 404);
    }
    ////
    const reviewerId = review.user
      ? review.user.toString()
      : review.userId?.toString();
    const isOwner = reviewerId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw createError("You are not authorized to delete this rewiew", 403);
    }

    //numReviewsوaverageRating الحزف واعادة حساب ال

    product.reviews.pull(rid);
    product.calcAverageRating();
    await product.save();

    res.status(200).json({
      success:true,
      message: "The Review is deleted successfully",
      data: {
        averageRating: product.averageRating,
        numReviews: product.numReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  searchProducts,
  deleteReview,
};