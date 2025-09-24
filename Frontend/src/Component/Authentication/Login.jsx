import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../../Context/UserContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(LoggedInUserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const notify = (msg, type = "success") =>
    toast[type](msg, { position: "top-right", autoClose: 2000 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/login-user`, form);
      login(data.token);

      // Decode token to get role
      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      notify("Login Successful!");
      if (role === "admin") {
        navigate("/admin/report");
      } else {
        navigate("/menu");
      }
    } catch {
      notify("Invalid Credentials ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-lg p-8 rounded-2xl w-96"
      >
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {["email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block font-semibold mb-1">
                {field === "email" ? "Email Address" : "Password"}
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                placeholder={`Enter your ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="animate-spin h-5 w-5 text-black mr-2"
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
              "Login"
            )}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-500 font-bold">
            Register
          </a>
        </p>
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default Login;
