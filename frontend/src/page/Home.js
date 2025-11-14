import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContainer";
import api from "../api";
import "../style/Home.css"


const categories = [
  {
    name: "Electronics",
    path: "/electronics",
    image: "/electronic.png",
  },
  {
    name: "Fashion",
    path: "/fashion",
    image: "/fashion.png",
  },
  {
    name: "Home & Living",
    path: "/home-living",
    image: "/HomeLiving.png",
  },
  {
    name: "Sports",
    path: "/sports",
    image: "/Sports.png",
  },
];
function HomePage() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProducts = () => {
      console.log('🔄 Fetching products...');
      api.getProducts({})
        .then(data => {
          console.log('✅ Products received:', data);
          const allProducts = data.products || [];
          const flashProducts = allProducts.filter(p => p.isFlashSale && new Date(p.flashSaleEnd) > new Date());
          setProducts(flashProducts.length > 0 ? flashProducts : allProducts.slice(0, 4));
          
          if (flashProducts.length > 0 && flashProducts[0].flashSaleEnd) {
            const endTime = new Date(flashProducts[0].flashSaleEnd);
            const now = new Date();
            const diff = Math.max(0, endTime - now);
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft({ hours, minutes, seconds });
          }
        })
        .catch(err => {
          console.error('❌ Error fetching products:', err);
          setProducts([]);
        });
    };
    
    fetchProducts();
    const handleProductUpdate = () => fetchProducts();
    window.addEventListener('productUpdated', handleProductUpdate);
    return () => window.removeEventListener('productUpdated', handleProductUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="homepage-container">
      {/* ✅ Hero Section */}
      <section className="hero-section">
        <h1>Discover Amazing Products</h1>
        <p>
          Shop the latest trends in electronics, fashion, home decor, and more.
          <br />
          Premium quality, unbeatable prices.
        </p>
        <Link to="/viewAll" className="shop-now-btn">
          Shop Now
        </Link>
      </section>

     

      {/* ✅ Flash Sale Section */}
      <section className="flash-sale-section">
        <div className="flash-header">
          <h2>⚡ Flash Sale</h2>
          <div className="timer">Ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</div>
        </div>
        <div className="flash-grid">
          {products.slice(0, 4).map((product) => {
            const discount = product.discount || 30;
            const oldPrice = (product.price / (1 - discount / 100)).toFixed(2);
            return (
              <div key={product.id} className="flash-card">
                <div className="discount-badge">-{discount}%</div>
                <Link to={`/product/${product.id}`}>
                  <img src={product.images?.[0] || "/download.jpeg"} alt={product.title} />
                  <h4>{product.title}</h4>
                  <div className="flash-price">
                    <span className="old-price">${oldPrice}</span>
                    <span className="new-price">${product.price}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ✅ Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-links">
          
        </div>

        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link to={cat.path} className="category-card" key={index}>
              <img src={cat.image} alt={cat.name} />
              <p>{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>
     
       {/* ✅ Featured Products Section */}
<section className="featured-products">
  <div className="featured-header">
    <h2>Featured Products</h2>
    <br />
    <br />
    <br />
    <Link to="/viewAll" className="view-all-btn">View All →</Link>
  </div>

  <div className="product-grid">
    {products.map((product) => (
      <div key={product.id} className="product-card">
        <Link to={`/product/${product.id}`}>
          <img src={product.images?.[0] || "/download.jpeg"} alt={product.title} />
          <h3>{product.title}</h3>
          <p className="rating">
            ⭐ {product.rating || "4.5"} <span>({product.reviews || 0})</span>
          </p>
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
</section>

     

     

      <section>
        <div className="subscribe"> 
          <p className="hd">Join Our Newsletter</p>
          <p className=" decs ">Get exclusive deals and updates delivered to your inbox</p>
          <form>
         <input type="text" id="email" placeholder="Enter your email" required/>
      

      <button type="submit">subscribe</button>
</form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
