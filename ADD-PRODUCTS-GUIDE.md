# 📦 How to Add More Products

## Step 1: Add Your Product Images

### Option A: Put images in backend uploads folder
```
d:\Shobhub\backend\uploads\
```
Example: `laptop.jpg`, `phone.png`, `shoes.jpg`

### Option B: Put images in frontend public folder
```
d:\Shobhub\frontend\public\
```

## Step 2: Add Products to Database

### Method 1: Using Admin Panel (Easiest)
1. Go to: http://localhost:3000/admin/login
2. Login with: admin@shophub.com / admin123
3. Click "Products" → "Add Product"
4. Fill in details and submit

### Method 2: Direct Database Insert (Quick)
Run this in MySQL:

```sql
INSERT INTO products (title, description, price, category, stock, rating, numReviews, images) 
VALUES 
('Laptop', 'High performance laptop', 999.99, 'Electronics', 25, 4.5, 50, '["laptop.jpg"]'),
('Smartphone', 'Latest smartphone', 699.99, 'Electronics', 40, 4.7, 120, '["phone.png"]'),
('Running Shoes', 'Comfortable running shoes', 89.99, 'Sports', 60, 4.4, 85, '["shoes.jpg"]');
```

### Method 3: Update seed.js file
Edit: `d:\Shobhub\backend\utils\seed.js`

Add your products to the array:
```javascript
const products = [
  ['Your Product Name', 'Description', 99.99, 'Category', 50, 4.5, 100, JSON.stringify(['/your-image.jpg'])],
  // Add more products here...
];
```

Then run:
```bash
cd backend
node utils/seed.js
```

## Image Path Format:

If image is in `backend/uploads/`:
```javascript
['/uploads/laptop.jpg']
```

If image is in `frontend/public/`:
```javascript
['/laptop.jpg']
```

Multiple images:
```javascript
['/laptop1.jpg', '/laptop2.jpg', '/laptop3.jpg']
```

## Quick Add Script

I'll create a script for you to easily add products!
