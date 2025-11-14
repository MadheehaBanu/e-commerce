const db = require('./config/database');

async function fixPacketSize() {
  try {
    await db.query('SET GLOBAL max_allowed_packet=67108864');
    console.log('✅ MySQL max_allowed_packet increased to 64MB');
    console.log('⚠️  Please restart MySQL service in XAMPP for changes to take effect');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\nManual fix:');
    console.log('1. Open XAMPP Control Panel');
    console.log('2. Click "Config" next to MySQL');
    console.log('3. Select "my.ini"');
    console.log('4. Add this line under [mysqld]:');
    console.log('   max_allowed_packet=64M');
    console.log('5. Save and restart MySQL');
    process.exit(1);
  }
}

fixPacketSize();
