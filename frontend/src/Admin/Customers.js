import React, { useState, useEffect } from 'react';
import api from '../api';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await api.getAllUsers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customerId) => {
    try {
      const data = await api.getUserDetails(customerId);
      setCustomerDetails(data);
      setSelectedCustomer(customerId);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      alert('Failed to load customer details');
    }
  };

  const handleBlockUser = async (customerId, blocked) => {
    try {
      await api.blockUser(customerId, blocked);
      alert(blocked ? 'User blocked successfully' : 'User unblocked successfully');
      fetchCustomers();
    } catch (err) {
      console.error('Error blocking user:', err);
      alert('Failed to update user status');
    }
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  if (loading) return <div className="customers-page"><h1>Loading...</h1></div>;

  return (
    <div className="customers-page">
      <h1>Customers ({customers.length})</h1>
      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td>{customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'Never'}</td>
              <td>
                <button className="view-btn" onClick={() => handleViewCustomer(customer.id)}>View</button>
                <button 
                  className={customer.blocked ? "unblock-btn" : "block-btn"} 
                  onClick={() => handleBlockUser(customer.id, !customer.blocked)}
                >
                  {customer.blocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCustomer && customerDetails && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Customer Details</h2>
            <div className="customer-info">
              <p><strong>Name:</strong> {customerDetails.user.name}</p>
              <p><strong>Email:</strong> {customerDetails.user.email}</p>
              <p><strong>Joined:</strong> {new Date(customerDetails.user.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Login:</strong> {customerDetails.user.lastLogin ? new Date(customerDetails.user.lastLogin).toLocaleString() : 'Never'}</p>
            </div>

            <h3>Order History ({customerDetails.orders.length})</h3>
            {customerDetails.orders.length > 0 ? (
              <div className="orders-list">
                {customerDetails.orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span><strong>Order #{order.id}</strong></span>
                      <span className={`status ${order.status}`}>{order.status}</span>
                    </div>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${order.total}</p>
                    <div className="order-items">
                      <strong>Items:</strong>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.title} - ${item.price} x {item.qty}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet</p>
            )}

            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
