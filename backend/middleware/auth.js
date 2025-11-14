const jwt = require('jsonwebtoken');
const db = require('../config/database');
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const [users] = await db.query('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [payload.id]);
    if (users.length === 0) return res.status(401).json({ message: 'User not found' });
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const admin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.admin = admin;
