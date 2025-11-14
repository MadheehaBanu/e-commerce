const db = require('./config/database');

async function checkProducts() {
  try {
    const [result] = await db.query('SELECT COUNT(*) as count FROM products');
    console.log('Total products in database:', result[0].count);
    
    const [products] = await db.query('SELECT id, title FROM products ORDER BY id DESC LIMIT 10');
    console.log('\nLast 10 products:');
    products.forEach(p => console.log(`ID: ${p.id}, Title: ${p.title}`));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkProducts();
