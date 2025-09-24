import React from "react";
import { useCart } from "../Context/CartContext";
import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, increment, decrement, remove } = useCart();
  const items = Object.values(cart);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleIndividualOrder = (item) =>
    navigate("/checkout", { state: { item } });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full bg-white shadow-sm p-4 flex items-center z-50">
        <button className="p-2" onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-800" />
        </button>
        <h5 className="mx-auto font-bold text-gray-900">Your Cart</h5>
        <FaUser size={20} className="text-gray-700" />
      </div>

      {/* Empty Cart State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center flex-1 px-4 pt-28">
          <video
            src="Cart.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-md rounded-2xl"
          />
          <p className="text-gray-500 mt-6 text-lg font-medium">
            Your cart is empty — start adding some delicious items!
          </p>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-24 pb-24">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col md:flex-row items-center md:items-start gap-4"
              >
                {/* Item Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 w-full">
                  <h5 className="font-semibold text-gray-800">{item.name}</h5>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </p>
                  <p className="font-bold text-green-600 mt-1">
                    Subtotal: ₹{item.price * item.quantity}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-3 rounded-lg font-medium"
                      onClick={() => handleIndividualOrder(item)}
                    >
                      Order Now
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium"
                      onClick={() => remove(item._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => decrement(item._id)}
                  >
                    <FaMinus />
                  </button>
                  <span className="font-bold text-lg">{item.quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => increment(item._id)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total */}
          <div className="text-right mt-8">
            <h4 className="font-bold text-green-600 text-xl">
              Total: ₹{total}
            </h4>
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold text-lg"
              onClick={() => navigate("/checkout", { state: { items } })}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
