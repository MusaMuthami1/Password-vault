module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  clientUrl: process.env.CLIENT_URL,
  encryptionKey: process.env.ENCRYPTION_KEY,
  encryptionIV: process.env.ENCRYPTION_IV
};
