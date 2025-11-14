require('dotenv').config();
const db = require('./config/database');

async function checkImagesColumn() {
  try {
    // Check if images column exists
    const [columns] = await db.query('SHOW COLUMNS FROM products LIKE "images"');
    
    if (columns.length === 0) {
      console.log('❌ Images column does not exist. Adding it...');
      await db.query('ALTER TABLE products ADD COLUMN images TEXT AFTER category');
      console.log('✅ Images column added successfully!');
    } else {
      console.log('✅ Images column already exists!');
      console.log('Column details:', columns[0]);
    }

    // Check sample products
    const [products] = await db.query('SELECT id, title, images FROM products LIMIT 5');
    console.log('\n📦 Sample products:');
    products.forEach(p => {
      console.log(`ID: ${p.id}, Title: ${p.title}, Images: ${p.images || 'NULL'}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkImagesColumn();
