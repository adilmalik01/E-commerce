import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/context";
import axios from "axios";

import Home from "./pages/home/home";
import Contact from "./pages/contact/contact";
import ProductDetail from "./components/productDetail";
import Profile from "./pages/profile/profile";
import About from "./pages/about/about";
import Cart from "./pages/cart/cart";
import Navbar from "./components/navbar";
import AdminNavbar from "./pages/admin/adminNavbar/adminNavbar";
import AdminDashboard from "./pages/admin/adminDashboard/adminDashboard";
import AddProduct from "./pages/admin/addProduct/addproduct";
import VeiwProducts from "./pages/admin/veiwproduct/veiwproducs";
import baseUrl from "./core";
import Allprodcuts from "./pages/allProducts/allProducts";
import AllOrders from "./pages/admin/allorders/allorders";
import OrderDetail from "./pages/admin/orderDetail/orderDetail";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Catergory from "./pages/admin/category/category";
import ForgetPassword from "./pages/forgetPassword/forgetPassword";
import OTP from "./pages/forgetPassword/otp";
import ResetPassword from "./pages/forgetPassword/resetPassword";

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  const userCheckLogin = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ping`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({
          type: "USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (e) {
      dispatch({
        type: "USER_LOGOUT",
      });
    }
  };

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    userCheckLogin(); // Include userCheckLogin here
  }, []);

  return (
    <div className="App">
      {state.isLogin === false ? (
        <div className="user">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Allprodcuts />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="otp" element={<OTP />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      ) : null}

      {state.role === "user" && state.isLogin ? (
        <div className="user">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Allprodcuts />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      ) : null}

      {state.role === "Admin" ? (
        <div className="admin flex">
          <AdminNavbar />
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            
            <Route path="newproduct" element={<AddProduct />} />
            <Route path="veiwproducts" element={<VeiwProducts />} />
            <Route path="allorders" element={<AllOrders />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="category" element={<Catergory />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace={true} />}
            />
          </Routes>
        </div>
      ) : null}
    </div>
  );
}

export default App;
