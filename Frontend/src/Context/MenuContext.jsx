import { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      // console.log("Ye hai Asli URL:", import.meta.env.VITE_BACKEND_URL);

      const response = await axios.get(`${API_URL}/menu-items`);
      if (response.data && Array.isArray(response.data.data)) {
        setMenuItems(response.data.data);
      } else {
        setMenuItems([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      setMenuItems([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <MenuContext.Provider
      value={{ menuItems, setMenuItems, loading, fetchMenuItems }}
    >
      {children}
    </MenuContext.Provider>
  );
};
