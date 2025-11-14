const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const api = {
  // Auth
  register: (data) => fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  login: (data) => fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams({...params, _t: Date.now()}).toString();
    return fetch(`${API_URL}/products?${query}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('API returned products:', data.products?.length || 0, 'Total:', data.total);
        return data;
      })
      .catch(err => {
        console.error('API Error:', err);
        throw err;
      });
  },

  getProduct: (id) => fetch(`${API_URL}/products/${id}?_t=${Date.now()}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  }).then(r => r.json()),

  getRelatedProducts: (id) => fetch(`${API_URL}/products/${id}/related`).then(r => r.json()),

  // Cart
  getCart: () => fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  addToCart: (productId, qty) => fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ productId, qty })
  }).then(r => r.json()),

  updateCart: (productId, qty) => fetch(`${API_URL}/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ productId, qty })
  }).then(r => r.json()),

  removeFromCart: (productId) => fetch(`${API_URL}/cart/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ productId })
  }).then(r => r.json()),

  // Orders
  createOrder: () => fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  getOrders: () => fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  // Admin
  getAllUsers: () => fetch(`${API_URL}/auth/users`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  getUserDetails: (id) => fetch(`${API_URL}/auth/users/${id}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  blockUser: (id, blocked) => fetch(`${API_URL}/auth/users/${id}/block`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ blocked })
  }).then(r => r.json()),

  getAllOrders: () => fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  updateOrderStatus: (id, status) => fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  }).then(r => r.json()),

  createProduct: (data) => fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  deleteProduct: (id) => fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  }).then(r => r.json()),

  updateProduct: (id, data) => fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  }).then(r => r.json()),
};

export default api;
