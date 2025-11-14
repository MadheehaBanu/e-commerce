const db = require('./config/database');

const products = [
  { title: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones', price: 89.99, category: 'Electronics', stock: 50, images: ['/airpod.jpeg'] },
  { title: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', price: 199.99, category: 'Electronics', stock: 30, images: ['/watchh.jpeg'] },
  { title: 'Gaming Console', description: 'Next-gen gaming console with 4K support', price: 499.99, category: 'Electronics', stock: 20, images: ['/play station.jpeg'] },
  { title: 'Tablet', description: '10-inch tablet with high-resolution display', price: 349.99, category: 'Electronics', stock: 40, images: ['/tablet.jpeg'] },
  
  { title: 'Running Shoes', description: 'Comfortable running shoes for daily training', price: 79.99, category: 'Fashion', stock: 100, images: ['/shoe.jpg'] },
  { title: 'Leather Bag', description: 'Premium leather handbag', price: 129.99, category: 'Fashion', stock: 25, images: ['/bag.png'] },
  { title: 'Casual T-Shirt', description: 'Cotton casual t-shirt', price: 24.99, category: 'Fashion', stock: 150, images: ['/fashion.png'] },
  { title: 'Denim Jeans', description: 'Classic fit denim jeans', price: 59.99, category: 'Fashion', stock: 80, images: ['/fashion.png'] },
  
  { title: 'Decorative Vase', description: 'Elegant ceramic vase for home decor', price: 39.99, category: 'HomeLiving', stock: 45, images: ['/HomeLiving.png'] },
  { title: 'Wall Art', description: 'Modern abstract wall art', price: 89.99, category: 'HomeLiving', stock: 30, images: ['/HomeLiving.png'] },
  { title: 'Throw Pillows', description: 'Soft decorative throw pillows set of 2', price: 29.99, category: 'HomeLiving', stock: 60, images: ['/HomeLiving.png'] },
  { title: 'Area Rug', description: 'Large area rug for living room', price: 149.99, category: 'HomeLiving', stock: 20, images: ['/HomeLiving.png'] },
  
  { title: 'Yoga Mat', description: 'Non-slip yoga mat with carrying strap', price: 34.99, category: 'Sports', stock: 70, images: ['/Sports.png'] },
  { title: 'Dumbbells Set', description: 'Adjustable dumbbells set 5-25 lbs', price: 119.99, category: 'Sports', stock: 35, images: ['/Sports.png'] },
  { title: 'Basketball', description: 'Official size basketball', price: 29.99, category: 'Sports', stock: 50, images: ['/basketball.jpeg'] },
  { title: 'Tennis Racket', description: 'Professional tennis racket', price: 89.99, category: 'Sports', stock: 25, images: ['/tennis.jpeg'] }
];

async function seedProducts() {
  try {
    for (const product of products) {
      await db.query(
        'INSERT INTO products (title, description, price, category, stock, rating, numReviews, images, isFlashSale, discount, flashSaleEnd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product.title, product.description, product.price, product.category, product.stock, 4.5, 0, JSON.stringify(product.images), 0, 0, null]
      );
      console.log(`✅ Added: ${product.title}`);
    }
    console.log(`\n✅ Successfully added ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedProducts();
