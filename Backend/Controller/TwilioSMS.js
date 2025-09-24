const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || "",
  process.env.TWILIO_AUTH_TOKEN || ""
);
const FROM_NUMBER = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

// Send order status update via WhatsApp
exports.sendOrderStatusUpdate = async (order, status) => {
  try {
    // Twilio ka id verify kr rha hai
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn("Twilio credentials not configured. Skipping message send.");
      return { success: false, message: "Twilio not configured" };
    }

    await client.messages.create({
      from: FROM_NUMBER,
      to: `whatsapp:+91${order.contact}`,
      body: `Hi ${order.name}, your order for *${order.item.name}* is now "${status}". Thank you!`,
    });

    return { success: true, message: "WhatsApp message sent successfully" };
  } catch (error) {
    console.warn("Twilio message failed:", error.message);
    return { success: false, message: error.message };
  }
};
