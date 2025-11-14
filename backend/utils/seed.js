require('dotenv').config();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', 
      ['Admin', 'admin@shophub.com', hashedPassword, true]);
    
    // Sample products
    const products = [
      ['Wireless Airpods', 'Premium sound quality with noise cancellation', 149.99, 'Electronics', 50, 4.5, 120, JSON.stringify(['/airpod.jpeg'])],
      ['Smart Watch', 'Stylish golden watch with fitness tracking', 299.99, 'Electronics', 30, 4.7, 85, JSON.stringify(['/stylish-golden-watch-white-surface.jpg'])],
      ['Gaming Console', 'Latest PlayStation with 4K gaming', 499.99, 'Electronics', 20, 4.8, 200, JSON.stringify(['/play station.jpeg'])],
      ['Tablet Device', 'High-resolution display tablet', 399.99, 'Electronics', 40, 4.6, 95, JSON.stringify(['/tablet.jpeg'])],
      ['Premium Headphones', 'Over-ear wireless headphones', 179.99, 'Electronics', 60, 4.4, 150, JSON.stringify(['/download.jpeg'])],
      ['Designer Handbag', 'Luxury leather handbag', 89.99, 'Fashion', 25, 4.5, 75, JSON.stringify(['/bag.png'])],
      ['Casual Sneakers', 'Comfortable everyday shoes', 79.99, 'Fashion', 45, 4.3, 110, JSON.stringify(['/shoe.jpg'])],
      ['Elegant Watch', 'Classic timepiece for any occasion', 199.99, 'Fashion', 35, 4.6, 90, JSON.stringify(['/watchh.jpeg'])],
      ['Summer Dress', 'Light and breezy summer wear', 49.99, 'Fashion', 50, 4.4, 65, JSON.stringify(['/21.jpeg'])],
      ['Denim Jacket', 'Classic blue denim jacket', 69.99, 'Fashion', 30, 4.5, 80, JSON.stringify(['/43.jpeg'])],
      ['Modern Lamp', 'Contemporary table lamp', 39.99, 'HomeLiving', 40, 4.2, 55, JSON.stringify(['/76.jpeg'])],
      ['Decorative Vase', 'Elegant ceramic vase', 29.99, 'HomeLiving', 60, 4.3, 45, JSON.stringify(['/765.jpeg'])],
      ['Wall Art', 'Beautiful canvas wall art', 59.99, 'HomeLiving', 35, 4.5, 70, JSON.stringify(['/7643.jpeg'])],
      ['Throw Pillows', 'Comfortable decorative pillows', 24.99, 'HomeLiving', 80, 4.1, 40, JSON.stringify(['/cbvb.jpeg'])],
      ['Area Rug', 'Soft and stylish area rug', 89.99, 'HomeLiving', 25, 4.4, 60, JSON.stringify(['/downl.jpeg'])],
      ['Yoga Mat', 'Non-slip exercise mat', 29.99, 'Sports', 70, 4.6, 130, JSON.stringify(['/Sports.png'])],
      ['Dumbbells Set', 'Adjustable weight dumbbells', 79.99, 'Sports', 40, 4.7, 95, JSON.stringify(['/Sports.png'])],
      ['Running Shoes', 'Lightweight running shoes', 99.99, 'Sports', 55, 4.5, 140, JSON.stringify(['/shoe.jpg'])],
      ['Sports Bag', 'Durable gym bag', 39.99, 'Sports', 45, 4.3, 75, JSON.stringify(['/bag.png'])],
      ['Water Bottle', 'Insulated sports bottle', 19.99, 'Sports', 100, 4.4, 85, JSON.stringify(['/Sports.png'])]
    ];
    
    for (const product of products) {
      await db.query(
        'INSERT INTO products (title, description, price, category, stock, rating, numReviews, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }
    
    console.log('✅ Database seeded with 20 products and 1 admin user');
    console.log('Admin credentials: admin@shophub.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
