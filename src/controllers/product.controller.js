import Product from "../models/Product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createError from "../utils/createError.js";

const createProduct = async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    price,
    category,
    stock,
    sku
  } = req.body;

  if (!req.files || req.files.length === 0) {
    throw createError("Product images are required", 400);
  }

  const results = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file.buffer))
  );

  const product = await Product.create({
    name,
    description,
    shortDescription,
    price,
    category,
    stock,
    sku,
    createdBy: req.user.userId,
    images: results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url
    }))
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
};

export default createProduct;