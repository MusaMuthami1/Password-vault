const crypto = require('crypto');

// Mock breach database - in production, this would connect to real breach APIs like HaveIBeenPwned
const mockBreachDatabase = [
  {
    service: 'Adobe',
    date: '2024-01-15',
    severity: 'high',
    compromisedData: ['email', 'password', 'name'],
    description: 'Data breach affecting 38 million accounts'
  },
  {
    service: 'Facebook',
    date: '2024-02-08', 
    severity: 'medium',
    compromisedData: ['email', 'phone'],
    description: 'Personal data exposed in security incident'
  },
  {
    service: 'LinkedIn',
    date: '2024-03-12',
    severity: 'low',
    compromisedData: ['email'],
    description: 'Email addresses in public data leak'
  },
  {
    service: 'Dropbox',
    date: '2024-04-20',
    severity: 'high',
    compromisedData: ['email', 'password'],
    description: 'Password hashes compromised in breach'
  },
  {
    service: 'Canva',
    date: '2024-05-15',
    severity: 'medium',
    compromisedData: ['email', 'name'],
    description: 'User data exposed in security incident'
  }
];

// Mock compromised password hashes (SHA-1 hashes of common compromised passwords)
const compromisedPasswordHashes = new Set([
  'b1b3773a05c0ed0176787a4f1574ff0075f7521e', // password123
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // password
  'e99a18c428cb38d5f260853678922e03abd83d6e', // 123456789
  '7c4a8d09ca3762af61e59520943dc26494f8941b', // 123456
  'b47cc0f1fe1525d34b0df15498d46361ad93654f', // qwerty
  'b03ddf3ca2e714a6548e7495e2a03f5e824eaac', // letmein
  '8cb2237d0679ca88db6464eac60da96345513964', // welcome
  '89e01536ac207279409d4de1e5253e01f4a1769e', // monkey
  'b1a0b16b7b86bee250e2c3c2c6c6daa3b7c1e7b2' // dragon
]);

/**
 * Hash a password using SHA-1 (for breach checking only)
 */
function hashPassword(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

/**
 * Check if a password has been compromised in known breaches
 */
async function checkPasswordBreach(password) {
  const hashedPassword = hashPassword(password);
  
  // In production, this would use HaveIBeenPwned API
  // For demo, using mock data
  const isCompromised = compromisedPasswordHashes.has(hashedPassword);
  
  return {
    compromised: isCompromised,
    breachCount: isCompromised ? Math.floor(Math.random() * 10000) + 1 : 0,
    severity: isCompromised ? (Math.random() > 0.5 ? 'high' : 'medium') : 'safe'
  };
}

/**
 * Check if an email has been involved in data breaches
 */
async function checkEmailBreach(email) {
  // Mock check - in production would use real breach APIs
  const domain = email.split('@')[1];
  const affectedBreaches = mockBreachDatabase.filter(breach => 
    Math.random() > 0.7 // Random chance for demo
  );
  
  return {
    breached: affectedBreaches.length > 0,
    breaches: affectedBreaches,
    totalBreaches: affectedBreaches.length
  };
}

/**
 * Comprehensive security audit for imported passwords
 */
async function auditImportedPasswords(passwords) {
  const results = {
    total: passwords.length,
    compromised: 0,
    weak: 0,
    strong: 0,
    duplicates: 0,
    old: 0,
    breaches: [],
    recommendations: []
  };
  
  const passwordCounts = {};
  const emailBreaches = new Set();
  
  for (const item of passwords) {
    // Check password strength
    const strength = calculatePasswordStrength(item.password);
    if (strength.score >= 3) {
      results.strong++;
    } else {
      results.weak++;
    }
    
    // Check for compromised passwords
    const breachCheck = await checkPasswordBreach(item.password);
    if (breachCheck.compromised) {
      results.compromised++;
      results.breaches.push({
        service: item.service,
        severity: breachCheck.severity,
        breachCount: breachCheck.breachCount
      });
    }
    
    // Check for duplicate passwords
    if (passwordCounts[item.password]) {
      passwordCounts[item.password]++;
      results.duplicates++;
    } else {
      passwordCounts[item.password] = 1;
    }
    
    // Check email breaches
    const emailCheck = await checkEmailBreach(item.username);
    if (emailCheck.breached) {
      emailBreaches.add(item.username);
      results.breaches.push(...emailCheck.breaches.map(breach => ({
        ...breach,
        affectedEmail: item.username
      })));
    }
    
    // Check password age (mock)
    const passwordAge = Math.floor(Math.random() * 1000); // Random days
    if (passwordAge > 365) {
      results.old++;
    }
  }
  
  // Generate recommendations
  if (results.compromised > 0) {
    results.recommendations.push({
      type: 'critical',
      title: `${results.compromised} compromised passwords found`,
      description: 'These passwords have been found in data breaches and should be changed immediately.',
      action: 'Update compromised passwords'
    });
  }
  
  if (results.weak > 0) {
    results.recommendations.push({
      type: 'warning',
      title: `${results.weak} weak passwords detected`,
      description: 'These passwords are vulnerable to attacks and should be strengthened.',
      action: 'Generate stronger passwords'
    });
  }
  
  if (results.duplicates > 0) {
    results.recommendations.push({
      type: 'info',
      title: `${results.duplicates} duplicate passwords found`,
      description: 'Using the same password for multiple accounts increases security risk.',
      action: 'Create unique passwords'
    });
  }
  
  return results;
}

/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password) {
  let score = 0;
  const feedback = { suggestions: [], warning: '' };
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score < 3) {
    feedback.suggestions.push('Use a longer password with mixed case, numbers, and symbols');
  }
  
  return { score: Math.min(score, 4), feedback };
}

/**
 * Mock Google Password Manager import
 */
async function mockGooglePasswordImport() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock imported passwords
  const mockPasswords = [
    { service: 'Gmail', username: 'user@gmail.com', password: 'MyStr0ngP@ssw0rd!' },
    { service: 'Facebook', username: 'user@gmail.com', password: 'password123' }, // Weak
    { service: 'LinkedIn', username: 'user@gmail.com', password: 'Linkedin2024!' },
    { service: 'Adobe', username: 'user@gmail.com', password: 'Creative2024' },
    { service: 'Netflix', username: 'user@gmail.com', password: 'Netflix@Home123' },
    { service: 'Amazon', username: 'user@gmail.com', password: 'Amaz0n$hopping' },
    { service: 'Dropbox', username: 'user@gmail.com', password: 'password' }, // Compromised
    { service: 'Spotify', username: 'user@gmail.com', password: 'Music2024!' },
    { service: 'GitHub', username: 'user@gmail.com', password: 'MyStr0ngP@ssw0rd!' }, // Duplicate
    { service: 'Twitter', username: 'user@gmail.com', password: 'Tweet@2024' }
  ];
  
  return mockPasswords;
}

module.exports = {
  checkPasswordBreach,
  checkEmailBreach,
  auditImportedPasswords,
  mockGooglePasswordImport,
  calculatePasswordStrength
};
