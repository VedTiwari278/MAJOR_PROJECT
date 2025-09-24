import React, { useContext } from "react";
import {
  FaHamburger,
  FaShoppingBasket,
  FaSignInAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import {
  MdOutlineMenuBook,
  MdOutlineAssessment,
  MdOutlineRestaurantMenu,
  MdAddCircleOutline,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { LoggedInUserContext } from "../Context/UserContext";
import { motion } from "framer-motion";

const NavBarLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-white font-semibold hover:text-yellow-400 transition"
  >
    <Icon className="text-lg" /> <span>{label}</span>
  </Link>
);

const BottomLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center text-gray-700 hover:text-yellow-500 text-xs"
  >
    <Icon size={24} />
    <span>{label}</span>
  </Link>
);

const NavBar = () => {
  const { user, logout } = useContext(LoggedInUserContext);
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartCount = Object.values(cart).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <>
      {/* Top Navbar for md+ screens */}
      <nav
        className="hidden md:flex fixed top-0 w-full items-center justify-between px-8 h-20 bg-gradient-to-r from-orange-700 via-yellow-400 to-orange-500 bg-opacity-95 backdrop-blur-sm shadow-lg font-poppins z-50"
        style={{ top: "0px", left: 0, right: 0 }}
      >
        <Link
          to="#"
          className="flex items-center space-x-3 select-none no-underline"
        >
          <motion.span
            whileHover={{ rotate: 20, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl text-yellow-300 drop-shadow-lg"
          >
            <FaHamburger />
          </motion.span>
          <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-yellow-300 via-white to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
            Campus <span className="text-orange-900">Craving</span>
          </span>
        </Link>

        <div className="flex space-x-6 items-center">
          {isUser && (
            <>
              <NavBarLink to="/menu" icon={MdOutlineMenuBook} label="Menu" />
              <div className="relative">
                <NavBarLink to="/cart" icon={IoMdCart} label="Cart" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <NavBarLink
                to="/my-orders"
                icon={FaShoppingBasket}
                label="My Orders"
              />
            </>
          )}

          {isAdmin && (
            <>
              <NavBarLink
                to="/admin/report"
                icon={MdOutlineAssessment}
                label="Report"
              />
              <NavBarLink to="/orders" icon={FaBoxOpen} label="Orders" />
              <NavBarLink
                to="/admin-side-menu"
                icon={MdOutlineRestaurantMenu}
                label="Available Menu"
              />
              <NavBarLink
                to="/admin/add-menu"
                icon={MdAddCircleOutline}
                label="Add Menu"
              />
            </>
          )}

          {!user ? (
            <NavBarLink to="/login" icon={FaSignInAlt} label="Login" />
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-orange-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Bottom Navbar for small screens */}
      <div className="md:hidden fixed bottom-0 w-full bg-gradient-to-r from-orange-700 via-yellow-400 to-orange-500 shadow-2xl flex justify-around py-2 border-t z-50">
        {isUser && (
          <>
            <BottomLink to="/menu" icon={MdOutlineMenuBook} label="Menu" />
            <div className="relative">
              <BottomLink to="/cart" icon={IoMdCart} label="Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <BottomLink
              to="/my-orders"
              icon={FaShoppingBasket}
              label="Orders"
            />
          </>
        )}

        {isAdmin && (
          <>
            <BottomLink
              to="/admin/report"
              icon={MdOutlineAssessment}
              label="Report"
            />
            <BottomLink to="/orders" icon={FaBoxOpen} label="Orders" />
            <BottomLink
              to="/admin-side-menu"
              icon={MdOutlineRestaurantMenu}
              label="Available Menu"
            />
            <BottomLink
              to="/admin/add-menu"
              icon={MdAddCircleOutline}
              label="Add Menu"
            />
          </>
        )}

        {!user ? (
          <BottomLink to="/login" icon={FaSignInAlt} label="Login" />
        ) : (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-700"
          >
            <FaSignInAlt size={24} />
            <span className="text-xs">Logout</span>
          </button>
        )}
      </div>
    </>
  );
};

export default NavBar;
