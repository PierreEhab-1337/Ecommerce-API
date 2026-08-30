
import mongoose from 'mongoose';
import { shippingAddress } from './Order.model.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: { type: String },
    avatar: { type: String, default: 'https://example.com/default-avatar.png' },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    addresses: [shippingAddress],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);