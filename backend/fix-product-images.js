require('dotenv').config();
const db = require('./config/database');

async function fixProductImages() {
  try {
    // Get products without images
    const [products] = await db.query('SELECT id, title, images FROM products');
    
    console.log(`Found ${products.length} products`);
    
    let updated = 0;
    for (const product of products) {
      if (!product.images || product.images === 'null' || product.images === '') {
        // Set default image
        const defaultImage = JSON.stringify(['/download.jpeg']);
        await db.query('UPDATE products SET images = ? WHERE id = ?', [defaultImage, product.id]);
        console.log(`✅ Updated product ${product.id}: ${product.title}`);
        updated++;
      } else {
        console.log(`✓ Product ${product.id} already has images: ${product.images}`);
      }
    }
    
    console.log(`\n🎉 Updated ${updated} products with default images!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixProductImages();
