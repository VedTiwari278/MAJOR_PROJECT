import React, { useContext, useEffect } from "react";
import { OrderContext } from "../../Context/OrdersContext";
import { FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import Metric_Card from "./Metric_Card";

const statusColors = {
  Pending: "yellow-500",
  Preparing: "blue-500",
  Ready: "sky-500",
  Delivered: "green-500",
  Cancelled: "red-500",
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Orders() {
  const { Order, setOrder, fetchOrder } = useContext(OrderContext);

  useEffect(() => {
    const t = setInterval(fetchOrder, 2500);
    return () => clearInterval(t);
  }, [fetchOrder]);

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/orders/update-status/${id}`, { status });
    setOrder((p) => p.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  if (!Order.length)
    return <p className="text-center text-gray-500 mt-5">No orders yet</p>;

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Dashboard Header */}
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-6">
        Welcome to your food delivery admin dashboard
      </p>

      {/* Metric Cards */}
      <Metric_Card />

      {/* Orders Section */}
      <div className="mb-3">
        <h4 className="flex items-center gap-2 text-lg font-bold">
          <FaClock className="text-blue-500" />
          Recent Orders
        </h4>
        <p className="text-gray-500">
          Latest order activity across all customers
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Item</th>
              <th className="px-4 py-2 text-left text-gray-600">Customer</th>
              <th className="px-4 py-2 text-left text-gray-600">Price</th>
              <th className="px-4 py-2 text-left text-gray-600">Qty</th>
              <th className="px-4 py-2 text-left text-gray-600">Address</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Order.map((o) => {
              const { name, price, imageUrl } = o.item || {};
              return (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-12 h-12 object-cover rounded mr-2"
                        />
                      )}
                      <span className="font-semibold">{name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-bold text-red-500">{o.name}</span>
                    <br />
                    <small className="text-gray-500">{o.contact}</small>
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ₹{price}
                  </td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2 max-w-[160px]">
                    <small className="block truncate" title={o.address}>
                      {o.address}
                    </small>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className={`border-2 border-${
                        statusColors[o.status]
                      } text-${statusColors[o.status]} rounded px-2 py-1`}
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
