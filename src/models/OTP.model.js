import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim:true
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    userData: {
        type: Object,
        default: null
    }
}, { timestamps: true }
);


otpSchema.pre("save", async function () {
    if (!this.isModified("otp")) {
        return;
    }
    this.otp = await bcryptjs.hash(this.otp, 10);
});


const OTP = mongoose.model("OTP", otpSchema);
export default OTP;

