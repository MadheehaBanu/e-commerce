require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err.message);
  });

app.get('/', (req, res) => res.json({ ok: true, msg: 'Shophub backend running' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
  app.use('/api/products', require('./routes/products'));
  console.log('✅ Products routes loaded');
  app.use('/api/cart', require('./routes/cart'));
  console.log('✅ Cart routes loaded');
  app.use('/api/orders', require('./routes/orders'));
  console.log('✅ Orders routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
