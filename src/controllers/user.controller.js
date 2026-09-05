import User from '../models/User.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcryptjs';

const AddUser = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;
        
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            throw createError('User with this email already exists', 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword, phone, role });
        await user.save();

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (e) {
        next(createError(e.message, 400));
    }
};

const GetAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (e) {
        next(createError(e.message, 500));
    }
};

const GetUserById = async (req, res) => {
    try {
        const _id = req.params.id;
        
        const user = await User.findById(_id).select('-password');
        
        if (!user) {
            throw createError('User not found', 404);
        }

        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (e) {
        next(createError(e.message, 500));
    }
};

export default {
    AddUser,
    GetAllUser,
    GetUserById
};