import React, { useEffect } from "react";
import "./App.css";
import { Chart } from "chart.js/auto";

function Dashboard({ onLogout }) {
  useEffect(() => {
    const createChart = (id, config) => {
      const ctx = document.getElementById(id);
      if (ctx) new Chart(ctx, config);
    };

    createChart("salesChart", {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Sales ($)",
            data: [0, 50, 30, 70, 20, 90, 40],
            borderColor: "#22c55e",
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { display: false } },
      },
    });

    createChart("ordersChart", {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          { label: "Orders", data: [2, 5, 3, 7], backgroundColor: "#3b82f6" },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { display: false } },
      },
    });

    createChart("customersChart", {
      type: "doughnut",
      data: {
        labels: ["New", "Returning"],
        datasets: [
          { data: [1, 3], backgroundColor: ["#a855f7", "#c4b5fd"] },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });

    createChart("productsChart", {
      type: "bar",
      data: {
        labels: ["A", "B", "C", "D"],
        datasets: [
          {
            label: "Products",
            data: [4, 2, 8, 5],
            backgroundColor: "#f97316",
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { display: false } },
      },
    });
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <ul className="menu">
          <li className="active">🏠 Dashboard</li>
          <li>📦 Products</li>
          <li>🛒 Orders</li>
          <li>👥 Customers</li>
        </ul>
        <div className="logout" onClick={onLogout}>
          🚪 Logout
        </div>
      </aside>

      <main className="main-content">
        <h1>Dashboard Overview</h1>
        <p className="subtext">Welcome back! Here's what's happening today.</p>

        <div className="cards">
          <div className="card">
            <h4>Total Sales</h4>
            <h2>$0.00</h2>
            <canvas id="salesChart"></canvas>
          </div>

          <div className="card">
            <h4>Orders</h4>
            <h2>0</h2>
            <canvas id="ordersChart"></canvas>
          </div>

          <div className="card">
            <h4>Customers</h4>
            <h2>1</h2>
            <canvas id="customersChart"></canvas>
          </div>

          <div className="card">
            <h4>Products</h4>
            <h2>8</h2>
            <canvas id="productsChart"></canvas>
          </div>
        </div>

        <div className="bottom-section">
          <div className="activity-box">
            <h4>Recent Activity</h4>
            <p>No recent activity yet.</p>
          </div>

          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <ul>
              <li>Add New Product</li>
              <li>View Orders</li>
              <li>Manage Customers</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
