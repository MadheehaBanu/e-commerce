const fs = require('fs');
const path = require('path');

// Very subtle, minimal orange palette - barely visible, very professional
const colorMap = {
  '#FF9966': '#FF7043',  // Muted Coral
  '#FFB380': '#FF8A65',  // Soft Terracotta
  '#FF8C5A': '#FF6E40',  // Gentle Orange
  '#FFC299': '#FFAB91',  // Light Coral
  '#E68A5C': '#FF7043',  // Muted
  '#E67A5C': '#FF6E40'   // Gentle
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

console.log('\n🎨 Updated to minimal, professional orange!');
