import React, { useState, useEffect } from 'react';
import api from '../api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="orders-page"><h1>Loading...</h1></div>;

  return (
    <div className="orders-page">
      <h1>Orders ({orders.length})</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user?.name || 'N/A'}</td>
              <td>{order.items?.length || 0}</td>
              <td>${order.total}</td>
              <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td>
                <select 
                  className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}
                  value={order.status || 'Pending'}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button className="view-btn">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
