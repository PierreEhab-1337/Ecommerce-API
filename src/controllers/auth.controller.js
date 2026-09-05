import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import createError from '../utils/createError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const { password: _, ...userData } = user.toObject();

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user: userData },
  });
});