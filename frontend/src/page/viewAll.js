import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContainer";
import api from "../api";
import "../style/ViewAll.css"

function ViewAllPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = () => {
      api.getProducts()
        .then(data => {
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
        })
        .catch(err => console.error('Error:', err));
    };
    
    fetchProducts();
    const handleProductUpdate = () => fetchProducts();
    window.addEventListener('productUpdated', handleProductUpdate);
    return () => window.removeEventListener('productUpdated', handleProductUpdate);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by price
    if (priceRange !== 'all') {
      if (priceRange === 'under50') filtered = filtered.filter(p => p.price < 50);
      if (priceRange === '50-100') filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
      if (priceRange === '100-150') filtered = filtered.filter(p => p.price > 100 && p.price <= 150);
      if (priceRange === '150-200') filtered = filtered.filter(p => p.price > 150 && p.price <= 200);
      if (priceRange === 'over200') filtered = filtered.filter(p => p.price > 200);
    }

    // Sort
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredProducts(filtered);
  }, [category, priceRange, sortBy, products]);

  return (
    <div className="viewall-container">
      <div className="viewall-hero">
        <h1>All Products</h1>
        <p>Discover {filteredProducts.length} amazing products</p>
      </div>

      <div className="viewall-content">
        <aside className="filters-sidebar">
          <h3>🔍 Filters</h3>
          
          <div className="filter-group">
            <h4>Category</h4>
            <label className="filter-option">
              <input type="radio" name="category" value="all" checked={category === 'all'} onChange={(e) => setCategory(e.target.value)} />
              <span>All Categories</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="category" value="Electronics" checked={category === 'Electronics'} onChange={(e) => setCategory(e.target.value)} />
              <span>Electronics</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="category" value="Fashion" checked={category === 'Fashion'} onChange={(e) => setCategory(e.target.value)} />
              <span>Fashion</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="category" value="HomeLiving" checked={category === 'HomeLiving'} onChange={(e) => setCategory(e.target.value)} />
              <span>Home & Living</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="category" value="Sports" checked={category === 'Sports'} onChange={(e) => setCategory(e.target.value)} />
              <span>Sports</span>
            </label>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <label className="filter-option">
              <input type="radio" name="price" value="all" checked={priceRange === 'all'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>All Prices</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="price" value="under50" checked={priceRange === 'under50'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>Under $50</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="price" value="50-100" checked={priceRange === '50-100'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>$50 - $100</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="price" value="100-150" checked={priceRange === '100-150'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>$100 - $150</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="price" value="150-200" checked={priceRange === '150-200'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>$150 - $200</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="price" value="over200" checked={priceRange === 'over200'} onChange={(e) => setPriceRange(e.target.value)} />
              <span>Over $200</span>
            </label>
          </div>

          <button className="clear-filters" onClick={() => { setCategory('all'); setPriceRange('all'); setSortBy('featured'); }}>Clear All Filters</button>
        </aside>

        <div className="products-section">
          <div className="products-header">
            <p>{filteredProducts.length} Products Found</p>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <img src={product.images?.[0] || "/download.jpeg"} alt={product.title} />
                  <h3>{product.title}</h3>
                  <p className="rating">⭐ {product.rating || "4.5"} <span>({product.numReviews || 0})</span></p>
                  <p className="price">${product.price}</p>
                </Link>
                <button className="add-cart-btn" onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    showNotification('Please login first to add items to cart', 'warning');
                    navigate('/login');
                    return;
                  }
                  try {
                    await api.addToCart(product.id, 1);
                    showNotification('Added to cart!', 'success');
                    window.dispatchEvent(new Event('cartUpdated'));
                  } catch (err) {
                    showNotification('Failed to add to cart', 'error');
                  }
                }}>🛒 Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAllPage;
