// models/Orders.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    contact: { type: String, required: true },

    locationType: {
      type: String,
      enum: ["canteen", "campus"],
      required: true,
    },
    tableNumber: { type: String }, // Optional for canteen
    address: { type: String }, // Optional for campus

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Razorpay"],
      default: "Cash on Delivery",
    },
    paymentId: { type: String }, // razorpay payment id
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Delivered"],
      default: "Pending",
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
