// CartService.js
const Cart = require("../Model/Cart");

// Get user's cart
exports.getUserCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Failed to fetch cart");
  }
};

// Update user's cart
exports.updateUserCart = async (userId, cartData) => {
  try {
    const itemsArray = Object.values(cartData || {});
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: itemsArray } },
      { new: true, upsert: true }
    );
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new Error("Failed to update cart");
  }
};

// Clear user's cart
exports.clearUserCart = async (userId) => {
  try {
    const clearedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
    return clearedCart;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }
};