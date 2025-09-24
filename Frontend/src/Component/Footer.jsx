import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPizzaSlice,
  FaBoxOpen,
  FaShoppingCart,
  FaSignInAlt,
  FaPhoneAlt,
  FaQuestionCircle,
  FaFileContract,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { icon: <FaPizzaSlice />, label: "Menu", to: "/menu" },
    { icon: <FaBoxOpen />, label: "My Orders", to: "/my-orders" },
    { icon: <FaShoppingCart />, label: "Cart", to: "/cart" },
    { icon: <FaSignInAlt />, label: "Login", to: "/login" },
  ];

  const support = [
    { icon: <FaPhoneAlt />, label: "Contact Us", to: "/contact" },
    { icon: <FaQuestionCircle />, label: "FAQ", to: "/faq" },
    {
      icon: <FaFileContract />,
      label: "Terms & Conditions",
      to: "/terms-and-conditions",
    },
  ];

  return (
    <footer
      className="text-white pt-8 pb-4 mt-auto font-sans"
      style={{ background: "linear-gradient(135deg, #262121, #1b1919)" }}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap justify-between gap-6 mb-6">
          {/* Brand + Social */}
          <div className="flex-1 min-w-[250px]">
            <div className="p-4 rounded shadow bg-white/5">
              <h5 className="font-bold mb-2 text-lg md:text-xl">
                Campus Craving
              </h5>
              <p className="mb-3 text-sm md:text-base text-gray-300">
                Fresh & delicious food straight from campus kitchen. Fast,
                tasty, affordable.
              </p>
              <div className="flex gap-3 text-xl">
                {[FaFacebookF, FaInstagram, FaTwitter, FaEnvelope].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white hover:text-yellow-300 transform hover:scale-125 transition-all duration-300"
                    >
                      <Icon />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[200px]">
            <div className="p-4 rounded shadow bg-white/5">
              <h6 className="font-bold mb-2 text-md md:text-lg">Quick Links</h6>
              <ul className="space-y-2">
                {links.map(({ icon, label, to }, i) => (
                  <li key={i}>
                    <Link
                      to={to}
                      className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-300"
                    >
                      {icon} {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support Links */}
          <div className="flex-1 min-w-[200px]">
            <div className="p-4 rounded shadow bg-white/5">
              <h6 className="font-bold mb-2 text-md md:text-lg">Support</h6>
              <ul className="space-y-2">
                {support.map(({ icon, label, to }, i) => (
                  <li key={i}>
                    <Link
                      to={to}
                      className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-300"
                    >
                      {icon} {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-400" />

        <div className="text-center text-gray-400 text-sm mt-4">
          &copy; {year} Campus Craving. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
