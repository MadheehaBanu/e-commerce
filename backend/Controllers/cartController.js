const db = require('../config/database');

exports.getCart = async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT c.productId, c.qty as quantity, p.title as name, p.price, p.images FROM cart c JOIN products p ON c.productId = p.id WHERE c.userId = ?',
      [req.user.id]
    );
    const formattedItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      image: JSON.parse(item.images || '[]')[0] || '/download.jpeg'
    }));
    const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items: formattedItems, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const [existing] = await db.query('SELECT * FROM cart WHERE userId = ? AND productId = ?', [req.user.id, productId]);
    
    if (existing.length > 0) {
      await db.query('UPDATE cart SET qty = qty + ? WHERE userId = ? AND productId = ?', [qty, req.user.id, productId]);
    } else {
      await db.query('INSERT INTO cart (userId, productId, qty) VALUES (?, ?, ?)', [req.user.id, productId, qty]);
    }
    
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (qty <= 0) {
      await db.query('DELETE FROM cart WHERE userId = ? AND productId = ?', [req.user.id, productId]);
    } else {
      await db.query('UPDATE cart SET qty = ? WHERE userId = ? AND productId = ?', [qty, req.user.id, productId]);
    }
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    await db.query('DELETE FROM cart WHERE userId = ? AND productId = ?', [req.user.id, productId]);
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
