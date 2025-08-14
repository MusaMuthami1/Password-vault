const jwt = require('jsonwebtoken');
const { jwtSecret, jwtRefreshSecret } = require('../config/keys');

function verifyJWT(req, res, next) {
  const token = req.cookies?.access_token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No access token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyJWT };
