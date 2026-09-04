import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

const AddUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).send("This email already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, phone, role });
        await user.save();

        return res.status(201).send("User saved successfully");
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

const GetAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.status(200).send(users);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

const GetUserById = async (req, res) => {
    try {
        const _id = req.params.id;
        
        const user = await User.findById(_id).select('-password');
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        return res.status(200).send(user);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

export default {
    AddUser,
    GetAllUser,
    GetUserById
};