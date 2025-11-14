// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./components/NotificationContainer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./page/Home";
import Electronics from "./page/Electronics";
import Fashion from "./page/Fashion";
import HomeLiving from "./page/HomeLiving";
import Sports from "./page/Sports";
import Contact from "./page/Contact";
import SearchResults from "./page/SearchResults";
import TrackOrder from "./page/TrackOrder";
import Login from "./page/Login";
import Signup from "./page/Signup";
import ForgotPassword from "./page/ForgotPassword";
import Profile from "./page/Profile";
import ViewAll from "./page/viewAll";
import AddtoCard from "./page/AddtoCard";
import Checkout from "./page/Checkout";
import ProductDetails from "./page/ProductDetails";
import AdminDashboard from "./Admin/AdminDashboard";
import DashboardHome from "./Admin/DashboardHome";
import Products from "./Admin/Products";
import Orders from "./Admin/Orders";
import Customers from "./Admin/Customers";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="app-root">
        <Navbar />

        {/* main-content grows to push footer down */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/home-living" element={<HomeLiving />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/viewAll" element={<ViewAll />} />
            <Route path="/addtocard" element={<AddtoCard />} /> 
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
            </Route>
          </Routes>
        </main>

        {/* footer must be after main content */}
        <Footer />
      </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
