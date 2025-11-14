const db = require('./config/database');

async function deleteAllProducts() {
  try {
    await db.query('DELETE FROM products');
    await db.query('ALTER TABLE products AUTO_INCREMENT = 1');
    console.log('✅ All products deleted and ID counter reset');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

deleteAllProducts();
