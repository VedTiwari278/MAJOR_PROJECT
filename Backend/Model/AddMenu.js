const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Veg", "Non Veg", "Drinks", "Dessert", "Pizza", "Burger", "Cake"],
    required: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  imagePublicId: { type: String },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
