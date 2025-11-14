const db = require('../config/database');

exports.createOrder = async (req, res) => {
  try {
    const [cartItems] = await db.query(
      'SELECT c.*, p.title, p.price, p.stock FROM cart c JOIN products p ON c.productId = p.id WHERE c.userId = ?',
      [req.user.id]
    );
    
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart empty' });
    
    // Check stock availability
    for (const item of cartItems) {
      if (item.qty > item.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.title}. Only ${item.stock} available.` 
        });
      }
    }
    
    let total = 0;
    const items = cartItems.map(item => {
      total += item.price * item.qty;
      return { productId: item.productId, title: item.title, price: item.price, qty: item.qty };
    });
    
    const [result] = await db.query(
      'INSERT INTO orders (userId, items, total) VALUES (?, ?, ?)',
      [req.user.id, JSON.stringify(items), total]
    );
    
    // Decrease stock for each product
    for (const item of cartItems) {
      await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.qty, item.productId]
      );
    }
    
    await db.query('DELETE FROM cart WHERE userId = ?', [req.user.id]);
    
    res.json({ id: result.insertId, items, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let query = 'SELECT o.*, u.name as userName, u.email as userEmail FROM orders o JOIN users u ON o.userId = u.id';
    const params = [];
    
    if (!req.user.isAdmin) {
      query += ' WHERE o.userId = ?';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY o.createdAt DESC';
    
    const [orders] = await db.query(query, params);
    orders.forEach(o => {
      o.items = JSON.parse(o.items || '[]');
      o.user = { name: o.userName, email: o.userEmail };
      delete o.userName;
      delete o.userEmail;
    });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ message: 'Not found' });
    
    const order = orders[0];
    order.items = JSON.parse(order.items || '[]');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin required' });
    
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
