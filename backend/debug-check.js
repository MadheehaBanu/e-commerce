require('dotenv').config();
const db = require('./config/database');

async function checkEverything() {
  console.log('🔍 DEBUGGING CHECKLIST\n');
  
  // 1. Check database connection
  try {
    await db.getConnection();
    console.log('✅ Database connected');
  } catch (err) {
    console.log('❌ Database connection failed:', err.message);
    return;
  }
  
  // 2. Check products table
  try {
    const [products] = await db.query('SELECT * FROM products LIMIT 5');
    console.log(`✅ Products table exists with ${products.length} products`);
    if (products.length > 0) {
      console.log('   Sample product:', products[0]);
    } else {
      console.log('⚠️  Products table is EMPTY - this is why nothing shows!');
    }
  } catch (err) {
    console.log('❌ Products table error:', err.message);
  }
  
  // 3. Check users table
  try {
    const [users] = await db.query('SELECT id, name, email FROM users LIMIT 3');
    console.log(`✅ Users table exists with ${users.length} users`);
  } catch (err) {
    console.log('❌ Users table error:', err.message);
  }
  
  // 4. Check environment
  console.log('\n📋 Environment Check:');
  console.log('   PORT:', process.env.PORT || '5000 (default)');
  console.log('   DB_HOST:', process.env.DB_HOST || 'localhost (default)');
  console.log('   DB_NAME:', process.env.DB_NAME || 'shophub (default)');
  
  process.exit(0);
}

checkEverything();
