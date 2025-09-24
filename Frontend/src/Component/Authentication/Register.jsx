import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/register-user`, form);
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`shadow-lg p-8 rounded-2xl w-96 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-4">
          Register
        </h2>

        <div className="flex justify-evenly font-bold mb-6 text-center">
          <p className="text-green-500">Order</p>
          <p className="text-red-500">Eat</p>
          <p className="text-blue-500">Repeat</p>
        </div>

        <form onSubmit={handleSubmit}>
          {["name", "email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block font-semibold mb-1">
                {field === "name"
                  ? "Full Name"
                  : field === "email"
                  ? "Email Address"
                  : "Password"}
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                placeholder={`Enter your ${field}`}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "border-gray-300"
                }`}
              />
            </div>
          ))}

          <motion.button
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg flex justify-center items-center disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Register"
            )}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-500 font-bold">
            Login
          </a>
        </p>

        {/* Dark Mode Toggle */}
        <div className="text-center mt-4">
          <button
            className="px-4 py-2 text-sm rounded border border-yellow-500 hover:bg-yellow-500 hover:text-black transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
