import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import createError from '../utils/createError.js';

const GetMyOrderById = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id; 

    const order = await Order.findOne({ _id: orderId, user: userId });
    
    if (!order) {
        throw createError('Order not found or unauthorized', 404);
    }

    res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        data: order
    });
};

const CancelMyOrder = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
        
        if (!order) {
            throw createError('Order not found or unauthorized', 404);
        }

        if (order.status !== 'pending' && order.status !== 'confirmed') {
            throw createError(`Cannot cancel order with status '${order.status}'. Only pending or confirmed orders can be cancelled.`, 400);
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        await order.save({ session });

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully and stock restored",
            data: order
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
};

export default {
    GetMyOrderById,
    CancelMyOrder
};