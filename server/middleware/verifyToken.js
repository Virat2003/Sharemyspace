const jwt = require('jsonwebtoken');
const User = require('../models/User');

// admin panel added
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user; // attach full user doc
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = verifyToken;
