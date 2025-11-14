import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/AddtoCard.css";

const AddtoCard = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api.getCart()
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setCart({ items: [], total: 0 });
        setLoading(false);
      });
  };

  const updateQuantity = async (productId, qty) => {
    await api.updateCart(productId, qty);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = async (productId) => {
    await api.removeFromCart(productId);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) return <div className="cart-page"><h2>Loading...</h2></div>;

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-container">
        {cart.items?.length > 0 ? (
          <>
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.image || "/download.jpeg"} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price} each</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.productId)} className="remove-btn">×</button>
              </div>
            ))}

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.total?.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${cart.total?.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>

              <button className="continue-btn" onClick={() => navigate("/home")}>Continue Shopping</button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <button onClick={() => navigate('/home')} className="continue-btn">Start Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddtoCard;
