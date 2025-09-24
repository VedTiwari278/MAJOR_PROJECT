import React, { useContext, useState } from "react";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../Context/CartContext";
import { motion } from "framer-motion";
import Filter from "./Filter";
import { MenuContext } from "../Context/MenuContext";

const Menu = () => {
  const { menuItems, loading } = useContext(MenuContext);
  const { cart, addToCart, increment, decrement } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Filter onCategorySelect={setSelectedCategory} />

      <div className="menu-section pt-14 md:pt-20 py-10 m-3 bg-gray-100">
        <h2 className="text-center text-yellow-500 font-bold text-3xl mb-5">
          Campus Menu
        </h2>

        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <span className="w-12 h-12 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const quantity = cart[item._id]?.quantity || 0;

                return (
                  <div key={item._id} className="flex">
                    <div className="bg-white shadow-md rounded-xl overflow-hidden w-full flex flex-col h-full">
                      {/* Image */}
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="h-40 w-full object-cover"
                      />

                      {/* Card Body */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col justify-between flex-1 p-3"
                      >
                        {/* Item Info */}
                        <div>
                          <h6 className="font-bold text-gray-800 truncate">
                            {item.name}
                          </h6>
                          <p className="text-gray-500 text-sm mb-2 h-16 overflow-hidden">
                            {item.description}
                          </p>
                          <p className="font-semibold text-red-600">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Cart Controls */}
                        <div className="mt-3">
                          {quantity > 0 ? (
                            <div className="flex justify-center items-center gap-3">
                              <button
                                className="p-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                                onClick={() => decrement(item._id)}
                              >
                                <FaMinus />
                              </button>
                              <span className="font-bold">{quantity}</span>
                              <button
                                className="p-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                                onClick={() => increment(item._id)}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded-lg font-bold flex items-center justify-center transition"
                              onClick={() => addToCart(item)}
                            >
                              <FaShoppingCart className="mr-2" /> Add
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
