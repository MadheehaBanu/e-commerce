import React, { useState, useEffect } from 'react';
import { useNotification } from '../components/NotificationContainer';
import api from '../api';
import './Products.css';

const Products = () => {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', stock: '', category: '', description: '', images: [], isFlashSale: false, discount: 0, flashSaleEnd: '' });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    
    if (files.length === 0) return;
    
    if ((imagePreviews.length + files.length) > 5) {
      alert('Maximum 5 images allowed');
      e.target.value = '';
      return;
    }
    
    const newPreviews = [];
    const newImages = [];
    let processed = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        console.log('Image loaded:', dataUrl.substring(0, 50));
        newPreviews.push(dataUrl);
        newImages.push(dataUrl);
        processed++;
        
        if (processed === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
          console.log('All images processed');
        }
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData({...formData, images: newImages});
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditId(product.id);
    const productImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
    setFormData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      images: productImages,
      isFlashSale: product.isFlashSale || false,
      discount: product.discount || 0,
      flashSaleEnd: product.flashSaleEnd ? product.flashSaleEnd.slice(0, 16) : ''
    });
    setImagePreviews(productImages);
    setShowModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        rating: 4.5,
        numReviews: 0,
        images: JSON.stringify(formData.images.length > 0 ? formData.images : ['/download.jpeg']),
        isFlashSale: formData.isFlashSale,
        discount: parseInt(formData.discount) || 0,
        flashSaleEnd: formData.flashSaleEnd || null
      };
      
      console.log('Sending product data:', {...productData, images: 'base64...'});
      
      const url = editMode 
        ? `http://localhost:5000/api/products/${editId}`
        : 'http://localhost:5000/api/products';
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      console.log('Server response:', result);
      
      if (response.ok) {
        showNotification(editMode ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', price: '', stock: '', category: '', description: '', images: [], isFlashSale: false, discount: 0, flashSaleEnd: '' });
        setImagePreviews([]);
        setTimeout(() => {
          fetchProducts();
          window.dispatchEvent(new Event('productUpdated'));
        }, 300);
      } else {
        console.error('Error response:', result);
        showNotification('Failed to save product: ' + (result.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showNotification('Failed to save product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.deleteProduct(id);
        showNotification('Product deleted successfully!', 'success');
        fetchProducts();
        window.dispatchEvent(new Event('productUpdated'));
      } catch (err) {
        showNotification('Failed to delete product', 'error');
      }
    }
  };

  if (loading) return <div className="products-page"><h1>Loading...</h1></div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products ({products.length})</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>Add Product</button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const productImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td><img src={productImages[0] || '/download.jpeg'} alt={product.title} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} /></td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="HomeLiving">Home & Living</option>
                <option value="Sports">Sports</option>
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData({...formData, isFlashSale: e.target.checked})}
                />
                <span>Flash Sale Product</span>
              </label>
              {formData.isFlashSale && (
                <>
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    min="0"
                    max="100"
                  />
                  <input
                    type="datetime-local"
                    value={formData.flashSaleEnd}
                    onChange={(e) => setFormData({...formData, flashSaleEnd: e.target.value})}
                  />
                </>
              )}
              <div className="image-upload-section">
                <label className="upload-label">Product Images (Max 5)</label>
                <div className="images-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button type="button" className="remove-image" onClick={() => removeImage(index)}>×</button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label htmlFor="image-input" className="add-image-btn">
                      <span>📷</span>
                      <p>Add Image</p>
                    </label>
                  )}
                </div>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{display: 'none'}}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">{editMode ? 'Update Product' : 'Add Product'}</button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setEditId(null);
                  setFormData({ title: '', price: '', stock: '', category: '', description: '', images: [], isFlashSale: false, discount: 0, flashSaleEnd: '' });
                  setImagePreviews([]);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
