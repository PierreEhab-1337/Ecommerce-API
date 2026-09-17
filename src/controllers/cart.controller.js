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

const cartResponseStructure = (cart) => {
    const items = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product?.name,
        price: item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price ,
        image: item.product?.images?.[0]?.url,
        quantity: item.quantity,
    }));
    return(
        {
            subtotal: cart.subtotal,
            discountAmount: cart.discountAmount,
            total: cart.total,
            itemCount: cart.itemCount,
            coupon: cart.coupon.code || null,
            items,
        }
    )
};

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price discountPrice images");

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cartResponseStructure(cart),
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
      quantity,
    });
  }

  product.stock -= quantity;
  await product.save();
  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price discountPrice images");

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    data: cartResponseStructure(updatedCart),
  });
};

export const updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price discountPrice images");;
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const item = cart.items.find((item) => item.product._id.toString() === productId);
    if (!item) {
        throw createError("Item not found in cart", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw createError("Product not found", 404);
    }

    if (product.stock < quantity) {
        throw createError("Insufficient stock", 400);
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: cartResponseStructure(cart),
    });
};

export const removeCartItem = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price discountPrice images");
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId);
    if (itemIndex === -1) {
        throw createError("Item not found in cart", 404);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cartResponseStructure(cart),
    });
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      $set: {
        items: [],
      },
      $unset: {
        coupon: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });
};

// post cart coupon

export const postCartsCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  if (!userId) {
    throw createError("userId is required", 400);
  }

  if (!code || !Coupons[code]) {
    throw createError("This code is invalid or expired !!", 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw createError("Cart not found", 404);
  }

  const coupon = Coupons[code];
  cart.coupon = {
    code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  };

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon is applied successfully",
    data: { cart },
  });
};

// delete cart coupon

export const deleteCartsCoupon = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw createError("userId is required", 400);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw createError("Cart not found", 404);
  }

  cart.coupon = undefined;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon is deleted successfully",
    data: { cart },
  });
};
