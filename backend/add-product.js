require('dotenv').config();
const db = require('./config/database');

// 📝 EDIT THIS SECTION TO ADD YOUR PRODUCTS
const newProducts = [
  {
    title: 'Gaming Laptop',
    description: 'High-end gaming laptop with RTX graphics',
    price: 1299.99,
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    numReviews: 95,
    images: ['/laptop.jpg'] // Put laptop.jpg in backend/uploads/ folder
  },
  {
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 29.99,
    category: 'Electronics',
    stock: 100,
    rating: 4.3,
    numReviews: 45,
    images: ['/mouse.jpg']
  },
  // Add more products here...
];

async function addProducts() {
  try {
    for (const product of newProducts) {
      const imagesStr = JSON.stringify(product.images);
      await db.query(
        'INSERT INTO products (title, description, price, category, stock, rating, numReviews, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.title, product.description, product.price, product.category, product.stock, product.rating, product.numReviews, imagesStr]
      );
      console.log('✅ Added:', product.title);
    }
    console.log('\n🎉 All products added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addProducts();
