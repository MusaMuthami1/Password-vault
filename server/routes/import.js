const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/auth');
const VaultItem = require('../models/VaultItem');
const { 
  mockGooglePasswordImport, 
  auditImportedPasswords,
  checkPasswordBreach,
  checkEmailBreach 
} = require('../utils/breachChecker');
const { encrypt } = require('../utils/encryption');

/**
 * @route   POST /api/import/google
 * @desc    Import passwords from Google Password Manager
 * @access  Private
 */
router.post('/google', verifyJWT, async (req, res) => {
  try {
    // Mock Google OAuth and password import
    const importedPasswords = await mockGooglePasswordImport();
    
    // Audit the imported passwords for security issues
    const auditResults = await auditImportedPasswords(importedPasswords);
    
    // Filter out passwords the user wants to import (for demo, import all)
    const passwordsToImport = importedPasswords;
    
    // Encrypt and save passwords to user's vault
    const savedItems = [];
    for (const item of passwordsToImport) {
      const encryptedPassword = encrypt(item.password);
      
      const vaultItem = new VaultItem({
        userId: req.user.id,
        title: item.service,
        username: item.username,
        password: encryptedPassword,
        website: `https://${item.service.toLowerCase()}.com`,
        notes: `Imported from Google Password Manager`,
        category: 'Login',
        tags: ['imported', 'google'],
        isImported: true,
        importSource: 'google',
        importDate: new Date(),
        customFields: []
      });
      
      const savedItem = await vaultItem.save();
      savedItems.push(savedItem);
    }
    
    res.json({
      success: true,
      message: 'Passwords imported successfully from Google Password Manager',
      imported: savedItems.length,
      total: importedPasswords.length,
      audit: auditResults,
      items: savedItems
    });
    
  } catch (error) {
    console.error('Google import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import from Google Password Manager',
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/import/breach-check
 * @desc    Check specific passwords for breaches
 * @access  Private
 */
router.post('/breach-check', verifyJWT, async (req, res) => {
  try {
    const { passwords, emails } = req.body;
    
    const results = {
      passwordResults: [],
      emailResults: [],
      summary: {
        totalChecked: 0,
        compromisedPasswords: 0,
        breachedEmails: 0
      }
    };
    
    // Check passwords
    if (passwords && passwords.length > 0) {
      for (const password of passwords) {
        const breachCheck = await checkPasswordBreach(password);
        results.passwordResults.push({
          password: password.substring(0, 3) + '***', // Masked for security
          ...breachCheck
        });
        
        if (breachCheck.compromised) {
          results.summary.compromisedPasswords++;
        }
      }
      results.summary.totalChecked += passwords.length;
    }
    
    // Check emails
    if (emails && emails.length > 0) {
      for (const email of emails) {
        const emailCheck = await checkEmailBreach(email);
        results.emailResults.push({
          email,
          ...emailCheck
        });
        
        if (emailCheck.breached) {
          results.summary.breachedEmails++;
        }
      }
    }
    
    res.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Breach check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check for breaches',
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/import/security-audit
 * @desc    Get security audit for user's vault
 * @access  Private
 */
router.get('/security-audit', verifyJWT, async (req, res) => {
  try {
    // Get all user's vault items
    const vaultItems = await VaultItem.find({ userId: req.user.id });
    
    // Convert to format expected by audit function
    const passwords = vaultItems.map(item => ({
      service: item.title,
      username: item.username,
      password: item.password // Note: This would need decryption in real implementation
    }));
    
    // Perform security audit
    const auditResults = await auditImportedPasswords(passwords);
    
    res.json({
      success: true,
      audit: auditResults,
      totalItems: vaultItems.length
    });
    
  } catch (error) {
    console.error('Security audit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to perform security audit',
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/import/csv
 * @desc    Import passwords from CSV file
 * @access  Private
 */
router.post('/csv', verifyJWT, async (req, res) => {
  try {
    const { csvData } = req.body;
    
    // Parse CSV data (simplified for demo)
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const passwords = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 3) {
        passwords.push({
          service: values[0] || 'Unknown Service',
          username: values[1] || '',
          password: values[2] || ''
        });
      }
    }
    
    // Audit imported passwords
    const auditResults = await auditImportedPasswords(passwords);
    
    // Save to vault (similar to Google import)
    const savedItems = [];
    for (const item of passwords) {
      if (item.password) {
        const encryptedPassword = encrypt(item.password);
        
        const vaultItem = new VaultItem({
          userId: req.user.id,
          title: item.service,
          username: item.username,
          password: encryptedPassword,
          website: '',
          notes: 'Imported from CSV file',
          category: 'Login',
          tags: ['imported', 'csv'],
          isImported: true,
          importSource: 'csv',
          importDate: new Date(),
          customFields: []
        });
        
        const savedItem = await vaultItem.save();
        savedItems.push(savedItem);
      }
    }
    
    res.json({
      success: true,
      message: 'Passwords imported successfully from CSV',
      imported: savedItems.length,
      total: passwords.length,
      audit: auditResults,
      items: savedItems
    });
    
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import from CSV',
      error: error.message 
    });
  }
});

module.exports = router;
