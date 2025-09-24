import React, { useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    // Disable scrolling when Index page loads
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when leaving Index page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="w-full h-screen relative text-white"
      style={{
        backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.6), 
          rgba(0, 0, 0, 0.6)
        ), url('./IndexImage.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="h-full flex flex-col justify-center items-center text-center px-4">
        <FaQrcode size={70} className="mb-4 text-yellow-500" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
          Welcome to <span className="text-yellow-500">Campus Craving</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-6">
          🍕 Scan, Browse, Order – All from your table 🍔
        </p>

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="bg-green-600 bg-opacity-75 px-4 py-2 rounded-lg shadow-md text-sm md:text-base font-semibold">
            ✅ Order directly from your phone
          </div>
          <div className="bg-blue-600 bg-opacity-75 px-4 py-2 rounded-lg shadow-md text-sm md:text-base font-semibold">
            ✅ No app download required
          </div>
          <div className="bg-red-600 bg-opacity-75 px-4 py-2 rounded-lg shadow-md text-sm md:text-base font-semibold">
            ✅ Fresh & hot meals every time
          </div>
        </div>

        {/* Start Ordering Button */}
        <Link
          to="/menu"
          className="px-6 py-3 rounded-full font-bold text-black shadow-lg transition-transform duration-200 hover:scale-105"
          style={{
            backgroundImage: "linear-gradient(45deg, #ffba08, #faa307)",
          }}
        >
          Start Ordering 🍽️
        </Link>
      </div>
    </div>
  );
};

export default Index;
