import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import '../style/CategoryPage.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      api.getProducts({ q: query })
        .then(data => {
          setProducts(data.products || []);
          setLoading(false);
        })
        .catch(() => {
          setProducts([]);
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) return <div className="category-page"><h1>Searching...</h1></div>;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Search Results</h1>
        <p>Found {products.length} products for "{query}"</p>
      </div>

      {products.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <h2>No products found</h2>
          <p>Try searching with different keywords</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
              <img src={product.images?.[0] || '/download.jpeg'} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="rating">⭐ {product.rating || '4.5'} <span>({product.numReviews || 0})</span></p>
              <p className="price">${product.price}</p>
              <button className="add-cart-btn" onClick={async (e) => {
                e.preventDefault();
                try {
                  await api.addToCart(product.id, 1);
                  alert('Added to cart!');
                  window.location.reload();
                } catch (err) {
                  alert('Please login first');
                }
              }}>🛒 Add to Cart</button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
