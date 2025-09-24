const express = require("express");
const router = express.Router();
const ClientController = require("../Controller/ClientController");

// Menu
router.get("/menu-items", ClientController.GetMenu);

// Orders
router.post("/orders", ClientController.Orders);
router.get("/get-orders", ClientController.AllOrders);
router.put("/orders/update-status/:id", ClientController.UpdateStatus);

// Cart
router.get("/cart/:userId", ClientController.getCart);
router.put("/cart/:userId", ClientController.updateCart);

// Razorpay
router.post("/payment/create-order", ClientController.createPaymentOrder);
router.post("/payment/verify", ClientController.verifyPayment);

module.exports = router;
