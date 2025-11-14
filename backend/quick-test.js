require('dotenv').config();
const mysql = require('mysql2/promise');

async function quickTest() {
  console.log('Testing database connection...\n');
  
  try {
    // Test connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    console.log('✅ MySQL connected');
    
    // Check if database exists
    const [dbs] = await connection.query("SHOW DATABASES LIKE 'shophub'");
    if (dbs.length === 0) {
      console.log('❌ Database "shophub" does NOT exist');
      console.log('\n🔧 FIX: Run FIX-DATABASE.bat');
    } else {
      console.log('✅ Database "shophub" exists');
      
      // Use database
      await connection.query('USE shophub');
      
      // Check products
      const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
      console.log(`✅ Products table has ${products[0].count} items`);
      
      if (products[0].count === 0) {
        console.log('\n⚠️  NO PRODUCTS IN DATABASE!');
        console.log('🔧 FIX: Run "node utils/seed.js" in backend folder');
      }
    }
    
    await connection.end();
  } catch (err) {
    console.log('❌ ERROR:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('\n🔧 FIX: MySQL is not running. Start MySQL service.');
    }
  }
}

quickTest();
