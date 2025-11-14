const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.query(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@shophub.com', hashedPassword, true]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@shophub.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Admin already exists');
      console.log('\nLogin credentials:');
      console.log('Email: admin@shophub.com');
      console.log('Password: admin123');
    } else {
      console.error('❌ Error:', err.message);
    }
    process.exit(1);
  }
}

createAdmin();
