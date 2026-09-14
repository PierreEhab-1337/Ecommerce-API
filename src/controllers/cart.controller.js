import Cart from "../models/Cart.model.js"
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