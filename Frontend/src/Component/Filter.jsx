import React, { useState } from "react";
import { motion } from "framer-motion";

const Filter = ({ onCategorySelect }) => {
  const categories = [
    {
      name: "All",
      img: "https://media.istockphoto.com/id/1560609530/photo/indian-girl-preparing-food-magnificent-young-woman-preparing-delicious-home-cooked.jpg?s=2048x2048&w=is&k=20&c=Jme0cLoBf7LM9FaSyiEJnEVB_rjLGvQ72rX0bEU8P38=",
    },
    {
      name: "Veg",
      img: "https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Non Veg",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Pizza",
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Burger",
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Biryani",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Cake",
      img: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const handleClick = (name) => {
    setActiveCategory(name);
    onCategorySelect(name);
  };

  return (
    <div
      className="fixed bg-white w-full shadow-md border-b py-2 px-3 z-40"
      style={{ top: "80px", left: 0, right: 0 }}
    >
      <motion.div className="flex justify-evenly gap-3 overflow-x-auto scrollbar-hide px-1">
        {categories.map((cat, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleClick(cat.name)}
            className={`flex-none flex items-center gap-2 justify-center px-4 py-2 rounded-full transition-all text-sm md:text-base font-semibold whitespace-nowrap
              ${
                activeCategory === cat.name
                  ? "bg-yellow-400 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-yellow-200"
              }`}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
            />
            <span>{cat.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Filter;
