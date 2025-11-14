const fs = require('fs');
const path = require('path');

const colorMap = {
  '#FF6600': '#FF9966',
  '#FF8800': '#FFB380',
  '#FF4400': '#FF8C5A',
  '#FFAA00': '#FFC299',
  '#CC5200': '#E68A5C',
  '#CC3300': '#E67A5C'
};

const files = [
  'frontend/src/components/Navbar.css',
  'frontend/src/components/Footer.css',
  'frontend/src/style/Home.css',
  'frontend/src/style/login.css',
  'frontend/src/style/signup.css',
  'frontend/src/style/AddtoCard.css',
  'frontend/src/style/ProductDetails.css',
  'frontend/src/style/Checkout.css',
  'frontend/src/style/CategoryPage.css',
  'frontend/src/Admin/AdminDashboard.css',
  'frontend/src/Admin/Products.css',
  'frontend/src/Admin/Orders.css',
  'frontend/src/Admin/Customers.css',
  'frontend/src/Admin/DashboardHome.css',
  'frontend/src/Admin/AdminLogin.css'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    Object.keys(colorMap).forEach(oldColor => {
      const regex = new RegExp(oldColor, 'gi');
      content = content.replace(regex, colorMap[oldColor]);
    });
    fs.writeFileSync(filePath, content);
    console.log('✅', file);
  }
});

console.log('\n🎨 All colors updated to soft orange palette!');
