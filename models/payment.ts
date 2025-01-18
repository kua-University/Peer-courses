import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        userId: { type: String, ref: "User", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        amountPaid: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["stripe", "paypal"], default: "stripe" },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
    },
    { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
