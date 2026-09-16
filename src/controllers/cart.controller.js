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

    if (product.stock < quantity) {
        throw createError("Insufficient stock", 400);
    }

    item.quantity = quantity;

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

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart
    });
};
