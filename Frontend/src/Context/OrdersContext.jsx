import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [Order, setOrder] = useState([]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}get-orders`);
      setOrder(res.data); // backend se fresh data
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <OrderContext.Provider value={{ Order, setOrder, fetchOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
