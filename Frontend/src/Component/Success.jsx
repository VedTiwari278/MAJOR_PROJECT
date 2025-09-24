import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Success = ({ name, orderId }) => {
  const navigate = useNavigate();
  console.log("Order ID : ", orderId);

  return (
    <div className="max-w-md mx-auto text-center py-12 px-4">
      <FaCheckCircle className="text-green-500 mb-4" style={{ fontSize: "4rem" }} />
      <h4 className="font-bold text-xl mb-2">Order Placed Successfully!</h4>
      <p className="text-gray-500 mb-4">
        Thank you, {name}. Your delicious order is on the way!
      </p>

      <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
        <p className="mb-1">
          <strong>Order ID:</strong> #{orderId}
        </p>
        <p className="mb-0">
          <strong>Estimated Delivery:</strong> 25-35 minutes
        </p>
      </div>

      <button
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 mb-3 rounded"
        onClick={() => navigate("/my-orders")}
      >
        Track Your Order
      </button>

      <button
        className="w-full border border-yellow-400 text-yellow-500 hover:bg-yellow-50 py-2 rounded"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Success;
