import React, { useContext, useMemo, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { OrderContext } from "../../Context/OrdersContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const Report = () => {
  const { Order } = useContext(OrderContext);
  const [activeTab, setActiveTab] = useState("overview");

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const {
    weeklyRevenue,
    weeklyOrders,
    monthlyRevenue,
    prevWeeklyRevenue,
    prevWeeklyOrders,
    prevMonthlyRevenue,
    categoryCounts,
  } = useMemo(() => {
    const revenueArr = [];
    const ordersArr = [];
    const prevRevenueArr = [];
    const prevOrdersArr = [];
    let monthRevenue = 0;
    let prevMonthRevenue = 0;
    const categoryMap = {};

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Current week
    weekDays.forEach((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const dayOrders = Order.filter(
        (o) => new Date(o.orderDate).toDateString() === date.toDateString()
      );

      const dayRevenue = dayOrders.reduce(
        (sum, o) => sum + o.item.price * (o.quantity || 1),
        0
      );

      revenueArr.push(dayRevenue);
      ordersArr.push(dayOrders.length);

      // Previous week same day
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - 7);
      const prevDayOrders = Order.filter(
        (o) => new Date(o.orderDate).toDateString() === prevDate.toDateString()
      );
      const prevDayRevenue = prevDayOrders.reduce(
        (sum, o) => sum + o.item.price * (o.quantity || 1),
        0
      );
      prevRevenueArr.push(prevDayRevenue);
      prevOrdersArr.push(prevDayOrders.length);
    });

    Order.forEach((o) => {
      const orderDate = new Date(o.orderDate);

      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        monthRevenue += o.item.price * (o.quantity || 1);
      }

      // Previous month
      if (
        orderDate.getMonth() === currentMonth - 1 &&
        orderDate.getFullYear() === currentYear
      ) {
        prevMonthRevenue += o.item.price * (o.quantity || 1);
      }

      // Count category
      const category = o.item.category || "Others";
      if (categoryMap[category]) categoryMap[category] += 1;
      else categoryMap[category] = 1;
    });

    return {
      weeklyRevenue: revenueArr,
      weeklyOrders: ordersArr,
      monthlyRevenue: monthRevenue,
      prevWeeklyRevenue: prevRevenueArr.reduce((a, b) => a + b, 0),
      prevWeeklyOrders: prevOrdersArr.reduce((a, b) => a + b, 0),
      prevMonthlyRevenue: prevMonthRevenue,
      categoryCounts: categoryMap,
    };
  }, [Order, today]);

  // Function to calculate % growth
  const calcGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const restaurantChartData = useMemo(() => {
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    const colors = [
      "rgba(16, 185, 129, 0.7)",
      "rgba(239, 68, 68, 0.7)",
      "rgba(59, 130, 246, 0.7)",
      "rgba(251, 191, 36, 0.7)",
      "rgba(139, 92, 246, 0.7)",
      "rgba(249, 115, 22, 0.7)",
    ];
    return {
      labels,
      datasets: [
        {
          label: "Orders by Category",
          data,
          backgroundColor: colors.slice(0, labels.length),
        },
      ],
    };
  }, [categoryCounts]);

  const weeklyChartData = {
    labels: weekDays,
    datasets: [
      {
        label: "Revenue",
        data: weeklyRevenue,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        yAxisID: "y1",
      },
      {
        label: "Orders",
        data: weeklyOrders,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        yAxisID: "y2",
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      y1: { type: "linear", position: "left", beginAtZero: true },
      y2: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: { drawOnChartArea: false },
      },
    },
  };

  const revenueLineChart = {
    labels: weekDays,
    datasets: [
      {
        label: "Revenue Growth",
        data: weeklyRevenue,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const customersLineChart = {
    labels: weekDays,
    datasets: [
      {
        label: "Customer Orders",
        data: weeklyOrders,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="container min-h-screen bg-yellow-200 p-4">
      <h3 className="text-2xl font-bold mb-1">Reports & Analytics</h3>
      <p className="text-gray-700 mb-4">
        Comprehensive insights into your food delivery business
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {["overview", "revenue", "customers"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white shadow p-4 rounded text-center">
              <small className="block text-gray-500">Weekly Revenue</small>
              <h5 className="text-xl font-bold">
                ${weeklyRevenue.reduce((a, b) => a + b, 0)}
              </h5>
              <p
                className={`text-${
                  weeklyRevenue.reduce((a, b) => a + b, 0) -
                    prevWeeklyRevenue >=
                  0
                    ? "green"
                    : "red"
                }-600 text-sm`}
              >
                {calcGrowth(
                  weeklyRevenue.reduce((a, b) => a + b, 0),
                  prevWeeklyRevenue
                )}
                % from last week
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded text-center">
              <small className="block text-gray-500">Weekly Orders</small>
              <h5 className="text-xl font-bold">
                {weeklyOrders.reduce((a, b) => a + b, 0)}
              </h5>
              <p
                className={`text-${
                  weeklyOrders.reduce((a, b) => a + b, 0) - prevWeeklyOrders >=
                  0
                    ? "green"
                    : "red"
                }-600 text-sm`}
              >
                {calcGrowth(
                  weeklyOrders.reduce((a, b) => a + b, 0),
                  prevWeeklyOrders
                )}
                % from last week
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded text-center">
              <small className="block text-gray-500">Monthly Revenue</small>
              <h5 className="text-xl font-bold">${monthlyRevenue}</h5>
              <p
                className={`text-${
                  monthlyRevenue - prevMonthlyRevenue >= 0 ? "green" : "red"
                }-600 text-sm`}
              >
                {calcGrowth(monthlyRevenue, prevMonthlyRevenue)}% from last
                month
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded text-center">
              <small className="block text-gray-500">Avg Delivery Time</small>
              <h5 className="text-xl font-bold">28 min</h5>
              <p className="text-red-500 text-sm">5.1% from last month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 bg-white shadow rounded p-3 h-96">
              <h6 className="font-semibold mb-2">Weekly Revenue & Orders</h6>
              <div className="h-72">
                <Bar data={weeklyChartData} options={weeklyChartOptions} />
              </div>
            </div>
            <div className="bg-white shadow rounded p-3 h-96">
              <h6 className="font-semibold mb-2">Orders by Category</h6>
              <div className="h-72">
                <Pie data={restaurantChartData} />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "revenue" && (
        <div className="bg-white shadow rounded p-3 h-96">
          <h6 className="font-semibold mb-2">Revenue Growth</h6>
          <div className="h-80">
            <Line data={revenueLineChart} options={lineOptions} />
          </div>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="bg-white shadow rounded p-3 h-96">
          <h6 className="font-semibold mb-2">Customer Orders Growth</h6>
          <div className="h-80">
            <Line data={customersLineChart} options={lineOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
