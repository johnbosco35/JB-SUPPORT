import { Schema, model } from "mongoose";

const refundSchema = new Schema(
  {
    orderNumber: String,
    email: String,
    item: String,
    amount: Number,
    message: String,
    category: String,
    summary: String,
    flagged: Boolean,
    decision: { type: String, enum: ["Approved", "Denied", "Escalated"] },
    checks: [{ rule: String, passed: Boolean, note: String, _id: false }],
    reply: String,
    aiUsed: Boolean,
  },
  { timestamps: true }
);

export default model("RefundRequest", refundSchema);
