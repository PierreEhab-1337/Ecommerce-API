import User from "../models/User.model.js";
import createError from "../utils/createError.js";

export const AddUser = async (req, res) => {
    const { username, email, password, phone, role } = req.body;
    
    const checkUser = await User.findOne({ email });
    if (checkUser) {
        throw createError('User with this email already exists', 400);
    }

    // مش محتاجين نعمل hashing هنا، الـ pre-save hook في الموديل هيعملها لوحده
    const user = new User({ username, email, password, phone, role });
    await user.save();

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
};

export const GetAllUser = async (req, res) => {
    // مش محتاجين .select('-password') لأنها ملوية تلقائياً select: false في الموديل
    const users = await User.find({});
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users
    });
};

export const GetUserById = async (req, res) => {
    const _id = req.params.id;
    
    const user = await User.findById(_id);
    
    if (!user) {
        throw createError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user
    });
};


export const updateUser = async (req, res) => {
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
export const deleteUser = async (req, res) => {
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