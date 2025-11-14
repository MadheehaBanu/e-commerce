import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    paymentMethod: 'card',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveInfo: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api.getCart()
      .then(data => setCartItems(data.items || []))
      .catch(() => setCartItems([]));
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    try {
      await api.createOrder();
      alert('Order placed successfully!');
      navigate('/track-order');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Secure Checkout</h2>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Payment</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Review</span>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <>
              <div className="checkout-section">
                <h3>📧 Contact Information</h3>
                <div className="form-grid">
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
              </div>

              <div className="checkout-section">
                <h3>🚚 Shipping Address</h3>
                <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} required />
                <div className="form-grid">
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                  <input type="text" name="state" placeholder="State / Province" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div className="form-grid">
                  <input type="text" name="zip" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleInputChange} required />
                  <select name="country" value={formData.country} onChange={handleInputChange}>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="SriLanka">Sri Lanka</option>
                  </select>
                </div>
                <label className="checkbox-label">
                  <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} />
                  <span>Save this information for next time</span>
                </label>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="checkout-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} />
                  <span>💳 Credit/Debit Card</span>
                </label>
                
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <input type="text" name="cardName" placeholder="Name on Card" value={formData.cardName} onChange={handleInputChange} />
                  <input type="text" name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleInputChange} maxLength="16" />
                  <div className="form-grid">
                    <input type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} maxLength="5" />
                    <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange} maxLength="3" />
                  </div>
                  <div className="card-logos">
                    <span>💳 Visa</span>
                    <span>💳 Mastercard</span>
                    <span>💳 Amex</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="checkout-section review-section">
              <h3>✅ Review Your Order</h3>
              <div className="review-item">
                <strong>Shipping To:</strong>
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                <p>{formData.country}</p>
              </div>
              <div className="review-item">
                <strong>Contact:</strong>
                <p>{formData.email}</p>
                <p>{formData.phone}</p>
              </div>
              <div className="review-item">
                <strong>Payment Method:</strong>
                <p>{formData.paymentMethod === 'card' ? 'Credit/Debit Card' : formData.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</p>
              </div>
            </div>
          )}

          <div className="checkout-actions">
            {step > 1 && <button className="back-btn" onClick={() => setStep(step - 1)}>← Back</button>}
            <button className="continue-btn" onClick={handlePlaceOrder}>
              {step === 3 ? '🎉 Place Order' : 'Continue →'}
            </button>
          </div>
        </div>

        <div className="checkout-summary">
          <h3>🛒 Order Summary</h3>
          <div className="summary-items">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <img src={item.image || '/download.jpeg'} alt={item.title} />
                <div>
                  <p>{item.title}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            )) : (
              <p className="empty-cart">Your cart is empty</p>
            )}
          </div>

          <div className="promo-code">
            <input type="text" placeholder="Enter promo code" />
            <button>Apply</button>
          </div>

          <div className="summary-totals">
            <div className="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <div className="security-badges">
            <span>🔒 Secure Checkout</span>
            <span>✅ SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
