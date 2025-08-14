const jwt = require('jsonwebtoken');
const { jwtSecret, jwtRefreshSecret } = require('../config/keys');

function generateAccessToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: '7d' });
}

function verifyToken(token, refresh = false) {
  return jwt.verify(token, refresh ? jwtRefreshSecret : jwtSecret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
