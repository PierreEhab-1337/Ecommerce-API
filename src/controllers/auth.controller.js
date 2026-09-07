import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import createError from "../utils/createError.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =========================
// Register
// =========================
export const register = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    role,
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError("Email already exists", 409);
  }

  const user = await User.create({
    username,
    email,
    password,
    phone,
    role,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  });
};

// =========================
// Login
// =========================
export const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  // password has select: false in User Model
  // so we must explicitly select it
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordCorrect =
    await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  });
};

export default {
  register,
  login,
};
