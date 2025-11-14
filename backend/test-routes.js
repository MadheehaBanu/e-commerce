require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products LIMIT 10');
    products.forEach(p => p.images = JSON.parse(p.images || '[]'));
    res.json({ products, total: products.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5001, () => console.log('Test server on http://localhost:5001'));
