import React, { useState } from 'react';
import '../style/TrackOrder.css';

function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (orderId.trim()) {
        // Mock order data
        setOrderData({
          id: orderId,
          status: 'Shipped',
          date: new Date().toLocaleDateString(),
          items: 3,
          total: 299.99,
          timeline: [
            { status: 'Order Placed', date: '2024-01-15', completed: true },
            { status: 'Confirmed', date: '2024-01-15', completed: true },
            { status: 'Shipped', date: '2024-01-16', completed: true },
            { status: 'Out for Delivery', date: '2024-01-17', completed: false },
            { status: 'Delivered', date: 'Pending', completed: false }
          ]
        });
      } else {
        setError('Please enter a valid order ID');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="track-order-page">
      <div className="track-hero">
        <h1>📦 Track Your Order</h1>
        <p>Enter your order ID to track your shipment</p>
      </div>

      <div className="track-container">
        <div className="track-form-section">
          <form onSubmit={handleTrack} className="track-form">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., ORD123456)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="order-input"
            />
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>

        {orderData && (
          <div className="order-details">
            <div className="order-header">
              <h2>Order #{orderData.id}</h2>
              <span className={`status-badge ${orderData.status.toLowerCase()}`}>
                {orderData.status}
              </span>
            </div>

            <div className="order-info">
              <div className="info-item">
                <span className="label">Order Date:</span>
                <span className="value">{orderData.date}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Items:</span>
                <span className="value">{orderData.items}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount:</span>
                <span className="value">${orderData.total}</span>
              </div>
            </div>

            <div className="order-timeline">
              <h3>Order Timeline</h3>
              <div className="timeline">
                {orderData.timeline.map((step, index) => (
                  <div key={index} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>{step.status}</h4>
                      <p>{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you have any questions about your order, please contact our customer support.</p>
          <div className="help-buttons">
            <button className="help-btn">📞 Call Support</button>
            <button className="help-btn">✉️ Email Us</button>
            <button className="help-btn">💬 Live Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
