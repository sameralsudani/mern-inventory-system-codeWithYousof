// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now() },
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
