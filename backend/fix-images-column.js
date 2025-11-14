const db = require('./config/database');

async function fixImagesColumn() {
  try {
    await db.query('ALTER TABLE products MODIFY COLUMN images LONGTEXT');
    console.log('✅ Images column updated to LONGTEXT');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixImagesColumn();
