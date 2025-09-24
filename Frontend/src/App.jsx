import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./Component/NavBar";
import Menu from "./Component/Menu";
import Index from "./Component/Index";
import Orders from "./Component/Admin/Orders";
import Cart from "./Component/Cart";
import AddMenu from "./Component/Admin/AddMenu";
import Report from "./Component/Admin/Report";
import AdminSideMenu from "./Component/Admin/AdminSideMenu";
import Footer from "./Component/Footer";
import EditMenu from "./Component/Admin/EditMenu";
import Login from "./Component/Authentication/Login";
import Register from "./Component/Authentication/Register";
import Checkout from "./Component/Checkout";
import MyOrder from "./Component/MyOrder";

import { MenuProvider } from "./Context/MenuContext";
import { CartProvider } from "./Context/CartContext";
import { OrderProvider } from "./Context/OrdersContext";
import { UserProvider } from "./Context/UserContext";
import TermsAndConditions from "./Component/TermsAndConditions";

const AppWrapper = () => {
  const location = useLocation();
  // Routes where Navbar should NOT appear
  const hideNavbarRoutes = ["/cart", "/checkout", "/my-orders"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-orders" element={<MyOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/edit-menu/:id" element={<EditMenu />} />
        <Route path="/admin-side-menu" element={<AdminSideMenu />} />
        <Route path="/admin/add-menu" element={<AddMenu />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <MenuProvider>
          <OrderProvider>
            <Router>
              <AppWrapper />
            </Router>
          </OrderProvider>
        </MenuProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
