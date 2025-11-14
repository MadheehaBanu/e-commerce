const db = require('./config/database');

async function findProduct() {
  try {
    const [result] = await db.query('SELECT * FROM products WHERE id = 23456');
    if (result.length > 0) {
      console.log('Product found in database:');
      console.log(result[0]);
    } else {
      console.log('Product ID 23456 NOT found in database');
    }
    
    const [all] = await db.query('SELECT id FROM products ORDER BY id');
    console.log('\nAll product IDs:', all.map(p => p.id).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

findProduct();
