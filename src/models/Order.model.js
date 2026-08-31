const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItem],
        required: true
    },
    shippingAddress: {
        type: shippingAddress,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'stripe', 'paypal', 'paymob'],
        default: 'cash',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionId: {
        type: String,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending',
    },
    paidAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
    customerNote: {
        type: String,
        maxLength: 1000,
    },
    adminNote: {
        type: String,
        maxLength: 1000,
    },
},
{
    timestamps: true, 
}
);

const Order = mongoose.model('Order', orderSchema);
export default Order;