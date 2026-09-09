import User from "../models/User.model.js";
import createError from "../utils/createError.js";


const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;


    const user = await User.findById(id);
    if (!user) {
        throw createError("User Not Found", 404);
    }
    if (req.user.id.toString() !== id) {
        throw createError("You are not authorized to update this user", 403);
    }
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });

};
const deleteUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw createError("User Not Found", 404);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
};

export default { updateUser, deleteUser };