import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { MenuContext } from "../../Context/MenuContext";
import { LoggedInUserContext } from "../../Context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const AdminSideMenu = () => {
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { menuItems, fetchMenuItems } = useContext(MenuContext);
  const { token } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMenuItems();
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/admin/delete-menu-item/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchMenuItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="spinner-border border-4 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
      </div>
    );

  if (!menuItems.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        No menu items available.
      </p>
    );

  return (
    <div className="py-4 min-h-screen relative">
      {/* Mobile Fixed Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm p-3 flex items-center z-50">
        <button className="btn p-2 mr-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-800" />
        </button>
        <h5 className="text-gray-800 font-bold m-0">Admin Menu Dashboard</h5>
      </div>

      {/* Spacer for mobile */}
      <div className="md:hidden h-16"></div>

      <h2 className="hidden md:block text-center text-2xl font-bold text-blue-600 mb-4">
        Admin Menu Dashboard
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-3 text-left">Image</th>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Category</th>
              <th className="py-2 px-3 text-left">Description</th>
              <th className="py-2 px-3 text-left">Price (₹)</th>
              <th className="py-2 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, i) => (
              <motion.tr
                key={item._id}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  delay: i * 0.05,
                }}
                className="border-b border-gray-200"
              >
                <td className="py-2 px-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-2 px-3 font-semibold">{item.name}</td>
                <td className="py-2 px-3">{item.category}</td>
                <td className="py-2 px-3 text-gray-600">
                  {item.description.length > 80
                    ? `${item.description.slice(0, 77)}...`
                    : item.description}
                </td>
                <td className="py-2 px-3 text-green-600 font-bold">
                  ₹{item.price}
                </td>
                <td className="py-2 px-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/edit-menu/${item._id}`}
                      className="px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="px-2 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                    >
                      {deletingId === item._id ? (
                        <div className="w-4 h-4 border-2 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSideMenu;
