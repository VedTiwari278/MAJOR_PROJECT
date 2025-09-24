const RazorpayService = require("./PaymentGateway");
const TwilioService = require("./TwilioSMS");
const CartService = require("./CartController"); // Import the Cart service
const crypto = require("crypto");
require("dotenv").config();

const Orders = require("../Model/Orders");
const Menu = require("../Model/AddMenu");

// ----------------- MENU FETCH -----------------
exports.GetMenu = async (req, res) => {
  try {
    const data = await Menu.find();
    res.status(200).json({ data, message: "Menu fetched successfully" });
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ----------------- PLACE ORDER (COD) -----------------
exports.Orders = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      paymentMethod,
      item,
      userId,
      locationType,
      tableNumber,
      address,
      orderDate,
      paymentId,
    } = req.body;

    if (!userId) return res.status(401).json({ error: "User not logged in" });
    if (!item || !item._id || !item.quantity)
      return res.status(400).json({ error: "Invalid item data" });

    const finalAddress =
      locationType === "canteen" ? `Table No: ${tableNumber}` : address;

    const order = new Orders({
      name,
      email,
      contact,
      locationType,
      tableNumber: locationType === "canteen" ? tableNumber : null,
      address: finalAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentId: paymentId || null,
      item: item._id,
      quantity: item.quantity,
      userId,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      status: "Pending",
    });

    await order.save();
    res.status(201).json({ message: "Order saved successfully", order });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ----------------- GET ALL ORDERS -----------------
exports.AllOrders = async (req, res) => {
  try {
    const data = await Orders.find()
      .populate("item", "name price imageUrl category description")
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ----------------- UPDATE ORDER STATUS + WhatsApp -----------------
exports.UpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("item", "name");

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    // Use Twilio service to send WhatsApp message
    await TwilioService.sendOrderStatusUpdate(updatedOrder, status);

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// ----------------- CART OPERATIONS -----------------
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartService.getUserCart(userId);
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message || "Failed to fetch cart" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart } = req.body;

    const updatedCart = await CartService.updateUserCart(userId, cart);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message || "Failed to update cart" });
  }
};

// ----------------- RAZORPAY CREATE ORDER -----------------
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderDetails } = req.body;

    const order = await RazorpayService.createPaymentOrder(orderDetails);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// ----------------- RAZORPAY VERIFY PAYMENT -----------------
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Verify payment using the service
    const verificationResult = await RazorpayService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    });

    const {
      name,
      email,
      contact,
      locationType,
      tableNumber,
      address,
      item,
      userId,
      orderDate,
    } = orderDetails;

    const finalAddress =
      locationType === "canteen" ? `Table No: ${tableNumber}` : address;

    const order = new Orders({
      name,
      email,
      contact,
      locationType,
      tableNumber: locationType === "canteen" ? tableNumber : null,
      address: finalAddress,
      paymentMethod: "Razorpay",
      paymentId: razorpay_payment_id,
      item: item._id,
      quantity: item.quantity,
      userId,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      status: "Pending",
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order saved",
      order,
    });
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment verification failed",
    });
  }
};
