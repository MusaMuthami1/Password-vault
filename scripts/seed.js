require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');
const User = require('../server/models/User');
const VaultItem = require('../server/models/VaultItem');
const bcrypt = require('bcrypt');
const { encrypt } = require('../server/utils/encryption');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ciphernest';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await VaultItem.deleteMany({});
    console.log('Cleared existing data');
    
    // Create test user
    const hash = await bcrypt.hash('Test@1234!', 12);
    const user = await User.create({
      email: 'test@ciphervault.com',
      password: hash,
      isVerified: true
    });
    console.log('Created test user');
    
    // Create sample vault items
    const samplePasswords = [
      { service: 'Gmail', username: 'test@gmail.com', password: 'MyGmail123!', tags: ['email', 'personal'] },
      { service: 'Facebook', username: 'testuser', password: 'SocialPass456@', tags: ['social', 'personal'] },
      { service: 'GitHub', username: 'testdev', password: 'CodeSecure789#', tags: ['work', 'development'] },
      { service: 'Bank of America', username: 'test@email.com', password: 'BankSafe101$', tags: ['financial'], notes: 'Main checking account' },
      { service: 'Netflix', username: 'test@email.com', password: 'StreamFun202%', tags: ['entertainment', 'subscription'] }
    ];
    
    for (const item of samplePasswords) {
      const encrypted = encrypt(item.password);
      await VaultItem.create({
        user: user._id,
        service: item.service,
        username: item.username,
        password: JSON.stringify(encrypted),
        notes: item.notes || '',
        tags: item.tags || []
      });
    }
    
    console.log('Seeded test user and vault items successfully!');
    console.log('Test credentials: test@ciphervault.com / Test@1234!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
