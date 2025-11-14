import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import api from "../api";
import "./Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateCartCount = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCart()
        .then(data => {
          const count = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    updateCartCount();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleAuthChange = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
      updateCartCount();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('authChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
   <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/home" className="logo">ShopHub</Link>

      <form className="search-box" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/electronics">Electronics</Link></li>
        <li><Link to="/fashion">Fashion</Link></li>
        <li><Link to="/home-living">Home & Living</Link></li>
        <li><Link to="/sports">Sports</Link></li>
      
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>

      <div className="nav-icons">
        {user ? (
          <Link to="/profile" className="user-btn user-avatar">{user.name?.charAt(0).toUpperCase()}</Link>
        ) : (
          <Link to="/login" className="user-btn"><FaUser /></Link>
        )}
        <Link to="/addtoCard" className="cart-btn">
          <FaShoppingCart />
          <span className="badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
