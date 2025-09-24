import React, { useContext, useEffect } from "react";
import { OrderContext } from "../Context/OrdersContext";
import { LoggedInUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaUser, FaBoxOpen } from "react-icons/fa";

const STEPS = ["Pending", "Preparing", "Ready", "Delivered"];

const MyOrder = () => {
  const { Order, fetchOrder } = useContext(OrderContext);
  const { user } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(fetchOrder, 3000);
    return () => clearInterval(timer);
  }, [fetchOrder]);

  const userOrders = Order.filter((o) => o.userId === user?.id);

  return (
    <div className=" min-h-screen bg-gray-100 pt-16">
      {/* Sticky Header */}
      <div className="fixed top-0 w-full z-50 bg-white shadow-sm p-3 flex items-center">
        <button className="p-2" onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-800" />
        </button>
        <h5 className="mx-auto font-bold text-gray-800">My Orders</h5>
        <FaUser size={20} className="text-gray-800" />
      </div>

      <AnimatePresence mode="wait">
        {userOrders.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center mt-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
              <FaBoxOpen size={60} className="text-gray-400 mb-3 mx-auto" />
              <h4 className="font-bold mb-2">No Orders Yet</h4>
              <p className="text-gray-500 mb-4">
                You haven’t placed any orders yet. Start exploring our menu and
                place your first order!
              </p>
              <img
                src="empty_order.jpeg"
                alt="No orders"
                className="w-full rounded-lg mb-4 object-cover"
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full"
                onClick={() => navigate("/menu")}
              >
                Browse Menu
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="container mx-auto px-4 py-4 md:py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userOrders.map(
                ({ _id, status, item = {}, createdAt, quantity = 1 }) => {
                  const stepIndex = STEPS.indexOf(status);
                  const { name, price = 0, imageUrl } = item;
                  const total = quantity * price;

                  return (
                    <div
                      key={_id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
                    >
                      <img
                        src={imageUrl || "/placeholder.png"}
                        alt={name || "Item"}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <h5 className="font-bold mb-1">{name}</h5>
                        <p className="text-gray-500 text-sm mb-2">
                          Ordered:{" "}
                          {new Date(createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex justify-between mb-3">
                          <span>
                            Qty: <strong>{quantity}</strong>
                          </span>
                          <span className="font-semibold text-green-600">
                            ₹{total}
                          </span>
                        </div>

                        {/* Progress Tracker */}
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 h-1 rounded-full">
                            <div
                              className="bg-green-500 h-1 rounded-full"
                              style={{
                                width: `${
                                  ((stepIndex + 1) / STEPS.length) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            {STEPS.map((s, i) => (
                              <span
                                key={i}
                                className={`${
                                  i <= stepIndex
                                    ? "font-semibold text-gray-800"
                                    : "text-gray-400"
                                }`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrder;
