import React, { useState, useEffect } from 'react';
import api from '../api';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, productsData, orders] = await Promise.all([
        api.getAllUsers(),
        api.getProducts(),
        api.getAllOrders()
      ]);
      setStats({
        products: (productsData.products || productsData).length || 0,
        orders: orders.length || 0,
        customers: users.length || 0
      });
      setRecentOrders((orders || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({ products: 0, orders: 0, customers: 0 });
      setRecentOrders([]);
    }
  };

  return (
    <div className="dashboard-home">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card products">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.products}</p>
        </div>
        <div className="stat-card orders">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.orders}</p>
        </div>
        <div className="stat-card customers">
          <h3>Total Customers</h3>
          <p className="stat-number">{stats.customers}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Sales Overview</h3>
            <div className="chart-placeholder">Chart Coming Soon</div>
          </div>
          <div className="chart-card">
            <h3>Order Status</h3>
            <div className="chart-placeholder">Chart Coming Soon</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Orders</h3>
        <ul className="activity-list">
          {recentOrders.length > 0 ? recentOrders.map(order => (
            <li key={order._id || order.id} className="activity-item">
              <span className="activity-text">
                Order #{(order._id || order.id || '').toString().slice(-6)} - {order.user?.name || 'Customer'} - ${order.total}
              </span>
              <span className="activity-time">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
            </li>
          )) : <li className="activity-item"><span className="activity-text">No recent orders</span></li>}
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
