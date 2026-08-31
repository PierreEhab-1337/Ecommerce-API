import mongoose from "mongoose";
// ------------------------------------------- Cart Schema ---------------------------------------------
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },

    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },

          name: {
            type: String,
            trim: true,
            required: true,
          },

          image: {
            type: String,
            trim: true,
            required: true,
          },

          price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
          },

          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            validate: {
              validator: Number.isInteger,
              message: "Quantity must be an integer",
            },
          },
        },
      ],
      default: [],
    },

    coupon: {
      code: {
        type: String,
        trim: true,
        uppercase: true,
      },
      discountType: {
        type: String,
        enum: {
          values: ["percentage", "fixed"],
          message: "Discount type must be percentage or fixed",
        },
      },
      discountValue: {
        type: Number,
        min: [0, "Discount cannot be negative"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// ------------------------------------------- SubTotal ----------------------------------------------------

cartSchema.virtual("subtotal").get(
    function () {
        return this.items.reduce((total, item) =>

            total + item.price * item.quantity, 0
        )
    }
)

// ------------------------------------------- Discount Amount ---------------------------------------------

cartSchema.virtual("discountAmount").get(function () {
  if (!this.coupon || !this.coupon.discountType) return 0;

    if (this.coupon.discountType === "percentage")
    {
        return this.subtotal * (this.coupon.discountValue / 100);
    }
    else if (this.coupon.discountType === "fixed")
    {
        return this.coupon.discountValue;
    }

  return 0; 
});

// ------------------------------------------- Total ------------------------------------------------------

cartSchema.virtual("total").get(
    function ()
    {
        return Math.max(0, this.subtotal - this.discountAmount);
    }
)

// ------------------------------------------- Item Count -------------------------------------------------

cartSchema.virtual("itemCount").get(
    function () {
        return this.items.reduce((total, item) =>
            total + item.quantity, 0
        )
    }
)

// ------------------------------------------- Exports ---------------------------------------------------

const Cart = mongoose.model("Cart", cartSchema)
export default Cart;