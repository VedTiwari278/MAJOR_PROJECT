import React, { useContext, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Context/MenuContext";
import { LoggedInUserContext } from "../../Context/UserContext";

const AddMenu = () => {
  const navigate = useNavigate();
  const { token } = useContext(LoggedInUserContext);
  const { fetchMenuItems } = useContext(MenuContext);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    imageFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [loader, setLoader] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.imageFile) data.append("imageUrl", formData.imageFile);

      await axios.post(`${API_URL}/admin/add-menu-item`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        imageFile: null,
      });
      setPreview(null);
      fetchMenuItems();
      navigate("/admin-side-menu");
    } catch (error) {
      console.error("Error submitting menu item:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Add New Menu Item
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Live Preview */}
        <div className="md:w-5/12">
          <motion.div
            className="bg-white shadow-md rounded-xl overflow-hidden h-full"
            whileHover={{ scale: 1.02 }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 font-semibold">
                Image Preview
              </div>
            )}
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-1">
                {formData.name || "Item Name"}
              </h5>
              <p className="text-yellow-500 mb-2">
                {formData.category || "Category"}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                {formData.description || "Item description will appear here."}
              </p>
              {formData.price && (
                <h6 className="text-green-600 font-semibold">
                  ₹ {formData.price}
                </h6>
              )}
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="md:w-7/12">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Category</option>
                <option value="Veg">Veg</option>
                <option value="Non Veg">Non Veg</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Cake">Cake</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="imageUrl"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-gray-700"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              disabled={loader}
            >
              {loader ? "Adding..." : "Add Menu Item"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
