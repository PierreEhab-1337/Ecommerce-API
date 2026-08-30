import mongoose from "mongoose";
// ------------------------------------------- Cart Schema ---------------------------------------------
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },

    items:
        [
            {
                product:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },

                name:
                {
                    type: String,
                    trim: true
                },

                image:
                {
                    type: String
                },

                price:
                {
                    type: Number
                },

                quantity:
                {
                    type: Number
                },
            }
        ],

    coupon: {
        code:
        {
            type: String,
            uppercase: true
        },
        discountType:
        {
            type: String,
            enum: ["percentage", "fixed"]
        },
        discountValue: Number,
    },

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });
// ------------------------------------------- SubTotal ----------------------------------------------------

cartSchema.virtual("subtotal").get(
    function () {
        return this.items.reduce((total, item) =>

            total + item.price * item.quantity, 0
        )
    }
)

// ------------------------------------------- Discount Amount ---------------------------------------------

cartSchema.virtual("discountAmount").get(
    function () {
        if (!this.coupon || !this.coupon.discountType)
            return 0;
        else {
            if (this.coupon.discountType === "percentage") {
                return this.subtotal * (this.coupon.discountValue / 100);
            }
            else if (this.coupon.discountType == "fixed") {
                return this.coupon.discountValue;
            }
        }
    }
)

// ------------------------------------------- Total ------------------------------------------------------

cartSchema.virtual("total").get(
    function () {
        return this.subtotal - this.discountAmount;
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