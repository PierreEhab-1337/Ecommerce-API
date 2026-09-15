import Cart from "../models/Cart.model.js"
import Product from "../models/Product.model.js";
import createError from "../utils/createError.js";
export const Coupons =
{
    SAVE10:
    {
        discountType: "percentage",
        discountValue: 10,
    },
    SAVE20:
    {
        discountType: "percentage",
        discountValue: 20,
    },
    SAVE50:
    {
        discountType: "percentage",
        discountValue: 50,
    },
    SAVE80:
    {
        discountType: "percentage",
        discountValue: 80,
    },
    OFF50:
    {
        discountType: "fixed",
        discountValue: 50,
    },
}

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: { cart },
  });
};

export const addItemToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw createError("Not enough stock available", 400);
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      quantity,
    });
  }

  product.stock -= quantity;
  await product.save();
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    data: { cart },
  });
};

export const updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
        throw createError("Item not found in cart", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw createError("Product not found", 404);
    }

    const difference = quantity - item.quantity;

    if (difference > 0) {
        if (product.stock < difference) {
            throw createError("Insufficient stock", 400);
        }
        product.stock -= difference;
    } else if (difference < 0) {
        product.stock += Math.abs(difference);
    }

    item.quantity = quantity;

    await product.save();
    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: cart
    });
};

export const removeCartItem = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
        throw createError("Item not found in cart", 404);
    }

    const product = await Product.findById(productId);
    if (product) {
        product.stock += cart.items[itemIndex].quantity;
        await product.save();
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart
    });
};