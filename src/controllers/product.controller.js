import Product from "../models/Product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createError from "../utils/createError.js";
import cloudinary from "../config/cloudinaryConfig.js";

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

// ----------------------------------------------- searchProducts ---------------------------------------------

export const searchProducts = async (req, res, next) => {
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
  const skip = (pageNum - 1) * limitNum; //1:1-10  2:11-20   p1==>p2 ((2-1)*10)=10 skip 10product

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
};

// ----------------------------------------------- createProduct -----------------------------------------------

export const createProduct = async (req, res, next) => {
    const {
      name,
      price,
      shortDescription,
      description,
      discountPrice,
      stock,
      sku,
      category,
      subcategory,
      brand,
      tags,
      featured,
      isActive,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return next(createError("At least one product image is required", 400));
    }

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const product = await Product.create({
      name,
      price,
      shortDescription,
      description,
      discountPrice,
      stock,
      sku,
      category,
      subcategory,
      brand,
      tags,
      featured,
      isActive,

      images: uploadedImages.map((image) => ({
        public_id: image.public_id,
        url: image.secure_url || image.url,
      })),

      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
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

// ----------------------------------------------- deleteReview ---------------------------------------------

export const deleteReview = async (req, res, next) => {
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
  const isOwner = reviewerId === req.user.id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw createError("You are not authorized to delete this rewiew", 403);
  }

  //numReviewsوaverageRating الحزف واعادة حساب ال

  product.reviews.pull(rid);
  if (typeof product.calcAverageRating === "function") {
    product.calcAverageRating();
  }
  await product.save();

  res.status(200).json({
    success: true,
    message: "The Review is deleted successfully",
    data: {
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    },
  });
};

// ----------------------------------------------- updateProduct ---------------------------------------------

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(createError("Product not found", 404));
  }

  const {
    name,
    price,
    shortDescription,
    description,
    discountPrice,
    stock,
    sku,
    category,
    subcategory,
    brand,
    tags,
    featured,
    isActive,
    imagesToDelete,
  } = req.body;

  // -----------------------------------
  // Delete selected images from Cloudinary
  // -----------------------------------

  let imagesToDeleteArray = [];

  if (imagesToDelete) {
    if (Array.isArray(imagesToDelete)) {
      imagesToDeleteArray = imagesToDelete;
    } else {
      imagesToDeleteArray = [imagesToDelete];
    }
  }

  if (imagesToDeleteArray.length > 0) {
    const productImageIds = product.images.map(
      (image) => image.public_id
    );

    const validImageIds = imagesToDeleteArray.filter((publicId) =>
      productImageIds.includes(publicId)
    );

    await Promise.all(
      validImageIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    product.images = product.images.filter(
      (image) => !validImageIds.includes(image.public_id)
    );
  }

  // -----------------------------------
  // Upload new images
  // -----------------------------------

  if (req.files && req.files.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const newImages = uploadedImages.map((image) => ({
      public_id: image.public_id,
      url: image.secure_url || image.url,
    }));

    product.images.push(...newImages);
  }

  // -----------------------------------
  // Update product data
  // -----------------------------------

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (shortDescription !== undefined)
    product.shortDescription = shortDescription;
  if (description !== undefined) product.description = description;
  if (discountPrice !== undefined)
    product.discountPrice = discountPrice;
  if (stock !== undefined) product.stock = stock;
  if (sku !== undefined) product.sku = sku;
  if (category !== undefined) product.category = category;
  if (subcategory !== undefined) product.subcategory = subcategory;
  if (brand !== undefined) product.brand = brand;
  if (tags !== undefined) product.tags = tags;
  if (featured !== undefined) product.featured = featured;
  if (isActive !== undefined) product.isActive = isActive;

  // Product must have at least one image
  if (!product.images || product.images.length === 0) {
    return next(
      createError("Product must have at least one image", 400)
    );
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

// ----------------------------------------------- deleteProduct ---------------------------------------------

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(createError("Product not found", 404));
  }

  // Delete all product images from Cloudinary
  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      )
    );
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};