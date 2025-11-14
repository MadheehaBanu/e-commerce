const db = require('./config/database');

async function addFlashSaleColumns() {
  try {
    await db.query('ALTER TABLE products ADD COLUMN isFlashSale BOOLEAN DEFAULT FALSE');
    await db.query('ALTER TABLE products ADD COLUMN discount INT DEFAULT 0');
    await db.query('ALTER TABLE products ADD COLUMN flashSaleEnd DATETIME');
    console.log('✅ Flash sale columns added');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addFlashSaleColumns();
