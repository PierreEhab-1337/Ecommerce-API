import Product from "../models/product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createError from "../utils/createError.js";

const createProduct = async (req, res) => {

  const {
    name,
    description,
    price,
    category,
    stock
  } = req.body;

  if (!req.file) {
    throw createError("Product image is required", 400);
  }

  const result = await uploadToCloudinary(req.file.buffer);

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image: {
      public_id: result.public_id,
      url: result.secure_url
    }
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
};

export default createProduct;