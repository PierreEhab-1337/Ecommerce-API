import mongoose from "mongoose";
const otpSehema = new mongoose.Schema({
    email: {
        type: String,
        required: true

    },
    otp: {
        type: String,
        required: true

    },
    expiresAt: {
        type: Date,
        required: true

    },
    userData: {
        type: Object

    }
});

const OTP = mongoose.model("OTP", otpSehema);
export default OTP;

