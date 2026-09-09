import Product from "../models/Product.model.js";
import createError from "../utils/createError.js";

// ----------------------------------------------- getProductById -----------------------------------------------

export const getProductById = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(createError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

// ----------------------------------------------- getActiveProduct ---------------------------------------------

export const getActiveProduct = async (req, res, next) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort,
  } = req.query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = { isActive: true };

  if (category) filter.category = category.toLowerCase();
  if (brand) filter.brand = brand;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const [activeProducts, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limitNumber).sort(sort),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: {
      products: activeProducts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    },
  });
};

// ----------------------------------------------- addReview -----------------------------------------------

export const addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw createError("Product not found", 404);
  }

  const userId = req.user.id;

  const alreadyReviewed = product.reviews.some(
    (review) => review.user.toString() === userId.toString()
  );

  if (alreadyReviewed) {
    throw createError("User has already reviewed this product", 409);
  }

  product.reviews.push({
    user: userId,
    rating,
    comment,
  });

  product.calcAverageRating();

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: product,
  });
};

// ----------------------------------------------- getProductReviews -----------------------------------------------

export const getProductReviews = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate(
    "reviews.user",
    "username"
  );

  if (!product) {
    throw createError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: product.reviews,
  });
};
