// razorpayService.js
const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// console.log(process.env.RAZORPAY_KEY_SECRET);

// Create Razorpay order
exports.createPaymentOrder = async (orderDetails) => {
  try {
    if (!orderDetails?.item) {
      throw new Error("Order details required");
    }

    const price = Number(orderDetails.item.price);
    const qty = Number(orderDetails.item.quantity);
    if (!price || !qty) {
      throw new Error("Invalid item price/quantity");
    }

    const options = {
      amount: Math.round(price * qty * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);

    return order;
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw error;
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (paymentData) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = paymentData;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderDetails
    ) {
      throw new Error("Missing fields");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    return {
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    throw error;
  }
};
