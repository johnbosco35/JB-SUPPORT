import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  purchasedAt: { type: Date, required: true },
  finalSale: { type: Boolean, default: false },
  refunded: { type: Boolean, default: false },
});

export default model("Order", orderSchema);
