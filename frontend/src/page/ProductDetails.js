import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContainer";
import api from "../api";
import "../style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    api.getProduct(id)
      .then(data => {
        const images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images || [];
        setProduct({...data, images});
        setMainImage(images[0] || "/download.jpeg");
      })
      .catch(() => {});
    
    api.getRelatedProducts(id)
      .then(data => setRelatedProducts(data))
      .catch(() => {});
  }, [id]);

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login first to add items to cart', 'warning');
      navigate('/login');
      return;
    }
    try {
      await api.addToCart(product.id, quantity);
      showNotification('Added to cart!', 'success');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      showNotification('Failed to add to cart', 'error');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <Link to="/viewAll" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-main">
        {/* Left: Images */}
        <div className="image-section">
          <img src={mainImage} alt={product.name} className="main-image" />
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`thumb ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="details-section">
          <h1>{product.title}</h1>
          <p className="rating">
            ⭐ {product.rating || "4.5"} <span>({product.reviews || 0} reviews)</span>
          </p>
          <p className="price">${product.price}</p>
          <p className="desc">{product.description}</p>

          <p className="availability">
            <strong>Availability:</strong>{" "}
            <span className="in-stock">
              In Stock ({product.stock} available)
            </span>
          </p>

          <div className="quantity-section">
            <strong>Quantity:</strong>
            <div className="qty-controls">
              <button onClick={decreaseQty} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={increaseQty} disabled={quantity >= product.stock}>+</button>
            </div>
          </div>

          <button className="add-cart-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="related-card">
                <img src={item.images[0] || '/download.jpeg'} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="related-price">${item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
