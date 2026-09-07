import User from "../models/User.model.js";
import createError from "../utils/createError.js";
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return next(
        createError("Username, email and password are required", 400)
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createError("Email already exists", 409));
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || "user"
    });

    res.status(201).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};