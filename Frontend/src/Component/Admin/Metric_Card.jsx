import React, { useContext } from "react";
import { FaRupeeSign, FaShoppingCart, FaUsers, FaChartLine } from "react-icons/fa";
import { OrderContext } from "../../Context/OrdersContext";

const Metric_Card = () => {
  let totalRevenue = 0;
  const customerSet = new Set(); // to store unique customer IDs
  let prevMonthRevenue = 0;
  let prevMonthOrders = 0;

  const { Order } = useContext(OrderContext);

  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  // Calculate total revenue, unique customers, previous month revenue & orders
  Order.forEach((element) => {
    const orderPrice = element.item.price * (element.quantity || 1);
    totalRevenue += orderPrice;

    // Add customerId to set
    if (element.userId) {
      customerSet.add(element.userId);
    }

    // Check if order is from previous month
    const orderDate = new Date(element.orderDate);
    const orderMonth = orderDate.getMonth();
    const orderYear = orderDate.getFullYear();

    let prevMonth = currentMonth - 1;
    let prevMonthYear = currentYear;
    if (prevMonth < 0) {
      prevMonth = 11; // December
      prevMonthYear = currentYear - 1;
    }

    if (orderMonth === prevMonth && orderYear === prevMonthYear) {
      prevMonthRevenue += orderPrice;
      prevMonthOrders++;
    }
  });

  // Calculate revenue growth % compared to previous month
  let revenueGrowth = 0;
  if (prevMonthRevenue > 0) {
    revenueGrowth =
      ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
  }

  // Calculate order growth % compared to previous month
  let orderGrowth = 0;
  if (prevMonthOrders > 0) {
    orderGrowth = ((Order.length - prevMonthOrders) / prevMonthOrders) * 100;
  }

  const totalCustomers = customerSet.size; // number of unique customers

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {/* Total Revenue */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <FaRupeeSign className="text-green-500 text-2xl mb-2 mx-auto" />
        <h5 className="text-lg font-semibold mb-1">₹ {totalRevenue}</h5>
        <small className="text-gray-500 block">
          {revenueGrowth >= 0
            ? `+${revenueGrowth.toFixed(1)}% from last month`
            : `${revenueGrowth.toFixed(1)}% from last month`}
        </small>
        <p className="font-bold mt-2">Total Revenue</p>
      </div>

      {/* Total Orders */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <FaShoppingCart className="text-blue-500 text-2xl mb-2 mx-auto" />
        <h5 className="text-lg font-semibold mb-1">{Order.length}</h5>
        <small className="text-gray-500 block">
          {orderGrowth >= 0
            ? `+${orderGrowth.toFixed(1)}% from last month`
            : `${orderGrowth.toFixed(1)}% from last month`}
        </small>
        <p className="font-bold mt-2">Total Orders</p>
      </div>

      {/* Active Customers */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <FaUsers className="text-teal-500 text-2xl mb-2 mx-auto" />
        <h5 className="text-lg font-semibold mb-1">{totalCustomers}</h5>
        <small className="text-gray-500 block">Unique customers</small>
        <p className="font-bold mt-2">Active Customers</p>
      </div>

      {/* Growth Rate (Revenue-based) */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <FaChartLine className="text-yellow-500 text-2xl mb-2 mx-auto" />
        <h5 className="text-lg font-semibold mb-1">
          {revenueGrowth >= 0
            ? `+${revenueGrowth.toFixed(1)}%`
            : `${revenueGrowth.toFixed(1)}%`}
        </h5>
        <small className="text-gray-500 block">Revenue Growth</small>
        <p className="font-bold mt-2">Growth Rate</p>
      </div>
    </div>
  );
};

export default Metric_Card;
