const crypto = require('crypto');
const { encryptionKey, encryptionIV } = require('../config/keys');

function encrypt(text) {
  const key = Buffer.from(encryptionKey, 'base64');
  const iv = Buffer.from(encryptionIV, 'base64');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();
  return {
    data: encrypted,
    tag: tag.toString('base64')
  };
}

function decrypt(encrypted, tag) {
  const key = Buffer.from(encryptionKey, 'base64');
  const iv = Buffer.from(encryptionIV, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
