import User from "../models/User.model.js";
import createError from "../utils/createError.js";

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw createError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: user,
    });
};

export const logout = async (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
