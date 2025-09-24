import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MenuContext } from "../../Context/MenuContext";
import { LoggedInUserContext } from "../../Context/UserContext";

const EditMenu = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(LoggedInUserContext);
  const { menuItems, fetchMenuItems } = useContext(MenuContext);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const menuItem = menuItems.find((item) => item._id === id);

  const [formData, setFormData] = useState({
    name: menuItem?.name || "",
    description: menuItem?.description || "",
    category: menuItem?.category || "",
    price: menuItem?.price || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(menuItem?.imageUrl || "");

  if (!menuItem)
    return <p className="text-center mt-4 text-gray-500">Loading menu item...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);

      if (imageFile) data.append("imageUrl", imageFile);

      const res = await axios.put(`${API_URL}/admin/update-menu/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res) {
        await fetchMenuItems();
        navigate("/admin-side-menu");
      }
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold mb-4">Edit Menu Item</h4>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Upload Image */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Image Preview</label>
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loader}
            className={`w-full p-3 rounded-md text-white font-semibold ${
              loader ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loader ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
