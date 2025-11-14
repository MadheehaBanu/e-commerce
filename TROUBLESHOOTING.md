# 🔧 Troubleshooting Guide - Why Nothing Shows on Frontend

## Quick Diagnosis Steps

### Step 1: Run the Test Script
```bash
TEST-CONNECTION.bat
```
This will check:
- ✅ Backend is running
- ✅ Database has data
- ✅ API endpoints work

### Step 2: Check Browser Console
1. Open your frontend in browser (http://localhost:3000)
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for:
   - 🔄 "Fetching products..." message
   - ✅ "Products received:" with data
   - ❌ Any red error messages

### Step 3: Check Network Tab
1. In Developer Tools, go to "Network" tab
2. Refresh the page
3. Look for request to `http://localhost:5000/api/products`
4. Click on it and check:
   - Status: Should be 200
   - Response: Should have products array

## Common Problems & Solutions

### Problem 1: "Failed to fetch" Error
**Cause:** Backend not running
**Solution:** 
```bash
START-BACKEND.bat
```

### Problem 2: Empty Products Array
**Cause:** Database is empty
**Solution:** Run the seed script
```bash
cd backend
node utils/seed.js
```

### Problem 3: CORS Error
**Cause:** Backend CORS not configured
**Solution:** Already fixed in server.js with `app.use(cors())`

### Problem 4: Wrong Product ID
**Cause:** Using MongoDB `_id` instead of MySQL `id`
**Solution:** ✅ Already fixed in Home.js

## Data Flow Diagram

```
Frontend (React)
    ↓ api.getProducts()
    ↓ fetch('http://localhost:5000/api/products')
    ↓
Backend (Express)
    ↓ /api/products route
    ↓ productController.getProducts()
    ↓ db.query('SELECT * FROM products...')
    ↓
Database (MySQL)
    ↓ Returns rows
    ↓
Backend
    ↓ res.json({ products: [...] })
    ↓
Frontend
    ↓ setProducts(data.products)
    ↓ Renders on page
```

## Manual Testing

### Test Backend Directly
Open browser and go to:
```
http://localhost:5000/api/products
```
You should see JSON with products array.

### Test Database Directly
```bash
cd backend
node debug-check.js
```

## Still Not Working?

Check these files:
1. `backend/.env` - Database credentials correct?
2. `backend/server.js` - Server running on port 5000?
3. `frontend/src/api.js` - API_URL is 'http://localhost:5000/api'?
