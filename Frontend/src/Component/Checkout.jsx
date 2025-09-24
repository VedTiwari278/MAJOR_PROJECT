import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { OrderContext } from "../Context/OrdersContext";
import { LoggedInUserContext } from "../Context/UserContext";
import {
  FaArrowLeft,
  FaUtensils,
  FaHome,
  FaMoneyBill,
  FaMobileAlt,
} from "react-icons/fa";
import Success from "./Success";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchOrder } = useContext(OrderContext);
  const { user } = useContext(LoggedInUserContext);
  const { state } = useLocation();
  const item = state?.item;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    address: "",
    tableNumber: "",
    locationType: "canteen",
    paymentMethod: "cod",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (!user?.id) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    const addressToSend =
      formData.locationType === "canteen"
        ? `Table No: ${formData.tableNumber}`
        : formData.address;

    const orderDetails = {
      ...formData,
      address: addressToSend,
      item,
      userId: user.id,
    };

    formData.paymentMethod === "upi"
      ? await handleRazorpayPayment(orderDetails)
      : await placeOrder("Cash on Delivery", orderDetails);
  };

  const placeOrder = async (paymentType, orderDetails) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/orders`, {
        ...orderDetails,
        paymentMethod: paymentType,
      });

      if (res.data?.order?._id) setOrderId(res.data.order._id);
      else if (res.data?._id) setOrderId(res.data._id);

      setSubmitted(true);
      await fetchOrder();
    } catch (err) {
      alert("Failed to place order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        resolve(true);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      document.body.appendChild(s);
    });

  const handleRazorpayPayment = async (orderDetails) => {
    try {
      setLoading(true);
      await loadRazorpayScript();
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(`${API_URL}/payment/create-order`, {
        orderDetails,
      });

      if (!data?.id) {
        alert("Payment initialization failed.");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_RA3UwDYeO95xUZ",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Campus Craving",
        description: "Food Order Payment",
        order_id: data.id,
        handler: async function (response) {
          if (!response.razorpay_payment_id) {
            alert("Payment failed");
            setLoading(false);
            return;
          }
          try {
            const verifyResp = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails,
            });

            if (verifyResp.data.success) {
              setOrderId(verifyResp.data.order?._id || "");
              setSubmitted(true);
              await fetchOrder();
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            alert("Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: { color: "#ff9800" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment popup closed.");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert("Payment initiation failed.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow p-3 flex items-center">
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-black" />
        </button>
        <h5 className="mx-auto font-bold text-black">Checkout</h5>
        <div className="w-8"></div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto py-6 px-4"
          >
            {/* Order Summary */}
            <div className="bg-white shadow rounded mb-4 p-4">
              <h6 className="font-bold mb-3 text-lg">Order Summary</h6>
              {item ? (
                <>
                  <div className="flex items-center mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </small>
                    </div>
                    <div className="font-semibold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                </>
              ) : (
                <p className="text-red-500">No item selected.</p>
              )}
            </div>

            {/* Billing Form */}
            <div className="bg-white shadow rounded p-4">
              <h6 className="font-bold mb-3 text-lg">Delivery Details</h6>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">
                    Delivery Location
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                        formData.locationType === "canteen"
                          ? "bg-yellow-400 text-black"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, locationType: "canteen" })
                      }
                    >
                      <FaUtensils />
                      <span>Canteen</span>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                        formData.locationType === "campus"
                          ? "bg-yellow-400 text-black"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, locationType: "campus" })
                      }
                    >
                      <FaHome />
                      <span>Campus</span>
                    </button>
                  </div>
                </div>

                {formData.locationType === "canteen" ? (
                  <div className="mb-3">
                    <label className="block font-semibold mb-1">
                      Table Number
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={formData.tableNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="block font-semibold mb-1">
                      Campus Address
                    </label>
                    <textarea
                      name="address"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="2"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Payment Method
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                        formData.paymentMethod === "cod"
                          ? "bg-yellow-400 text-black"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "cod" })
                      }
                    >
                      <FaMoneyBill />
                      <span>COD</span>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                        formData.paymentMethod === "upi"
                          ? "bg-yellow-400 text-black"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "upi" })
                      }
                    >
                      <FaMobileAlt />
                      <span>UPI</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₹${item ? item.price * item.quantity : "0"}`}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Success name={formData.name} orderId={orderId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
