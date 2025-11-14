import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../style/CategoryPage.css";

function Electronics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📦 Fetching Electronics...');
    api.getProducts({ category: 'Electronics' })
      .then(data => {
        console.log('✅ Electronics data:', data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="category-page"><h2>Loading...</h2></div>;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Electronics</h1>
        <p>Browse latest gadgets, headphones, and more</p>
      </div>

      <div className="product-grid">
        {products.length > 0 ? products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="product-card">
            <img src={product.images?.[0] || "/download.jpeg"} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="rating">⭐ {product.rating || "4.5"} <span>({product.numReviews || 0})</span></p>
            <p className="price">${product.price}</p>
            <button className="add-cart-btn">View Details</button>
          </Link>
        )) : <p>No products found</p>}
      </div>
    </div>
  );
}

export default Electronics;
