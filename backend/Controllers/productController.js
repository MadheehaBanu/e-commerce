const db = require('../config/database');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, rating, numReviews, images, isFlashSale, discount, flashSaleEnd } = req.body;
    console.log('Creating product:', { title, price, category, stock, isFlashSale, discount });
    const imagesStr = typeof images === 'string' ? images : JSON.stringify(images || ['/download.jpeg']);
    
    const [result] = await db.query(
      'INSERT INTO products (title, description, price, category, stock, rating, numReviews, images, isFlashSale, discount, flashSaleEnd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, category, stock, rating || 4.5, numReviews || 0, imagesStr, isFlashSale ? 1 : 0, discount || 0, flashSaleEnd || null]
    );
    
    console.log('✅ Product inserted with ID:', result.insertId);
    res.json({ id: result.insertId, message: 'Product created successfully' });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, rating, numReviews, images, isFlashSale, discount, flashSaleEnd } = req.body;
    const imagesStr = typeof images === 'string' ? images : JSON.stringify(images || ['/download.jpeg']);
    
    await db.query(
      'UPDATE products SET title = ?, description = ?, price = ?, category = ?, stock = ?, rating = ?, numReviews = ?, images = ?, isFlashSale = ?, discount = ?, flashSaleEnd = ? WHERE id = ?',
      [title, description, price, category, stock, rating || 4.5, numReviews || 0, imagesStr, isFlashSale ? 1 : 0, discount || 0, flashSaleEnd || null, req.params.id]
    );
    console.log('✅ Product updated:', req.params.id);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ message: 'Not found' });
    
    const product = products[0];
    product.images = JSON.parse(product.images || '[]');
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const [current] = await db.query('SELECT category FROM products WHERE id = ?', [req.params.id]);
    if (current.length === 0) return res.json([]);
    
    const [products] = await db.query(
      'SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4',
      [current[0].category, req.params.id]
    );
    products.forEach(p => p.images = JSON.parse(p.images || '[]'));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 100, category, q, sort } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (q) {
      query += ' AND title LIKE ?';
      params.push(`%${q}%`);
    }
    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else query += ' ORDER BY id ASC';
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [products] = await db.query(query, params);
    products.forEach(p => {
      try {
        p.images = JSON.parse(p.images || '[]');
      } catch (err) {
        console.error(`Error parsing images for product ${p.id}:`, err.message);
        p.images = ['/download.jpeg'];
      }
    });
    
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM products');
    const total = countResult[0].total;
    
    console.log(`Fetched ${products.length} products, total: ${total}, IDs: ${products.map(p => p.id).join(', ')}`);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: err.message });
  }
};
