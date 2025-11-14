import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Shop Info */}
        <div className="footer-col">
          <h3>ShopHub</h3>
          <p>Your one-stop destination for quality products at unbeatable prices.</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/viewAll">All Products</Link></li>
            <li><Link to="/addtoCard">Shopping Cart</Link></li>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/track-order">Order Tracking</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-col">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/home">Shipping Info</Link></li>
            <li><Link to="/home">Returns</Link></li>
            <li><Link to="/home">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive deals</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" required />
            <button type="submit">✉️</button>
          </form>
        </div>
      </div>

      <hr />
      <p className="copyright">© 2025 ShopHub. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
