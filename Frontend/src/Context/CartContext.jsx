import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    try {
      userId = JSON.parse(atob(token.split(".")[1])).id;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  // Load cart - priority: user cart -> localStorage
  useEffect(() => {
    if (userId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
      if (Object.keys(guestCart).length > 0) {
        syncCartWithBackend(guestCart);
        localStorage.removeItem("guestCart");
      }

      axios
        .get(`${API_URL}/cart/${userId}`)
        .then((res) => {
          const items = res.data.items || [];
          const normalized = items.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
          }, {});
          setCart(normalized);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
      setCart(guestCart);
    }
  }, [userId]);

  // Sync cart with backend or localStorage
  const syncCartWithBackend = async (newCart) => {
    if (!userId) {
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }
    try {
      await axios.put(`${API_URL}/cart/${userId}`, {
        cart: newCart,
      });
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  };

  // Add to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const updated = {
        ...prev,
        [item._id]: prev[item._id]
          ? { ...prev[item._id], quantity: prev[item._id].quantity + 1 }
          : { ...item, quantity: 1 },
      };
      syncCartWithBackend(updated);
      return updated;
    });
  };

  // Increment item
  const increment = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const updated = {
        ...prev,
        [id]: { ...prev[id], quantity: prev[id].quantity + 1 },
      };
      syncCartWithBackend(updated);
      return updated;
    });
  };

  // Decrement item
  const decrement = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const newQty = prev[id].quantity - 1;
      const updated =
        newQty <= 0
          ? Object.fromEntries(
              Object.entries(prev).filter(([key]) => key !== id)
            )
          : { ...prev, [id]: { ...prev[id], quantity: newQty } };
      syncCartWithBackend(updated);
      return updated;
    });
  };

  // ✅ Remove item completely
  const remove = (id) => {
    setCart((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== id)
      );
      syncCartWithBackend(updated);
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increment, decrement, remove }}
    >
      {children}
    </CartContext.Provider>
  );
};
