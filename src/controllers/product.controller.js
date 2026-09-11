import Product from "../models/Product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createError from "../utils/createError.js";

export const createProduct = async (req, res, next) => {
  try {
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

      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};