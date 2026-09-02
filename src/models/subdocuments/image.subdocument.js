import mongoose from "mongoose";
const imageSchema = new mongoose.Schema(
    {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);
export default imageSchema;