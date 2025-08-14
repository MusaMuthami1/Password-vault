const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/auth');

// M-Pesa Payment Handler
router.post('/mpesa', verifyJWT, async (req, res) => {
  try {
    const { phoneNumber, amount, plan, userId } = req.body;
    
    if (!phoneNumber || !amount || !plan) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate phone number format
    const kenyanPhoneRegex = /^(254|0)[7][0-9]{8}$/;
    const cleanPhone = phoneNumber.replace(/[-\s]/g, '');
    
    if (!kenyanPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid Kenyan phone number format' });
    }
    
    // Format phone number for M-Pesa (254xxxxxxxxx)
    const formattedPhone = cleanPhone.startsWith('0') ? 
      '254' + cleanPhone.substring(1) : 
      cleanPhone;
    
    console.log(`M-Pesa Payment Initiated:
      Phone: ${formattedPhone}
      Amount: KES ${amount}
      Plan: ${plan}
      User: ${userId}
    `);
    
    // Simulate M-Pesa STK Push
    // In production, you would integrate with Safaricom's Daraja API
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      // Here you would:
      // 1. Update user's subscription in database
      // 2. Send confirmation email
      // 3. Log transaction
      
      res.json({
        success: true,
        message: 'Payment successful',
        transactionId,
        amount: amount,
        phone: formattedPhone,
        plan: plan,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again or check your M-Pesa balance.',
        code: 'PAYMENT_FAILED'
      });
    }
    
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing failed. Please try again.',
      error: error.message 
    });
  }
});

// Credit Card Payment Handler
router.post('/card', verifyJWT, async (req, res) => {
  try {
    const { cardDetails, amount, plan, userId } = req.body;
    
    if (!cardDetails || !amount || !plan) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const { number, expiry, cvv, name } = cardDetails;
    
    // Basic validation
    if (!number || !expiry || !cvv || !name) {
      return res.status(400).json({ message: 'All card details are required' });
    }
    
    // Validate card number (basic Luhn algorithm)
    const cleanCardNumber = number.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return res.status(400).json({ message: 'Invalid card number' });
    }
    
    console.log(`Card Payment Initiated:
      Card: **** **** **** ${cleanCardNumber.slice(-4)}
      Amount: $${amount/100}
      Plan: ${plan}
      User: ${userId}
    `);
    
    // Simulate payment processing
    const transactionId = 'CARD' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate successful payment (95% success rate)
    const success = Math.random() > 0.05;
    
    if (success) {
      res.json({
        success: true,
        message: 'Payment successful',
        transactionId,
        amount: amount,
        last4: cleanCardNumber.slice(-4),
        plan: plan,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment declined. Please check your card details or try a different card.',
        code: 'CARD_DECLINED'
      });
    }
    
  } catch (error) {
    console.error('Card payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing failed. Please try again.',
      error: error.message 
    });
  }
});

// PayPal Payment Handler
router.post('/paypal', verifyJWT, async (req, res) => {
  try {
    const { amount, plan, userId } = req.body;
    
    if (!amount || !plan) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    console.log(`PayPal Payment Initiated:
      Amount: $${amount/100}
      Plan: ${plan}
      User: ${userId}
    `);
    
    // Generate PayPal checkout URL
    const paypalUrl = `https://www.paypal.com/checkoutnow?amount=${amount/100}&currency=USD&item=${plan}`;
    
    res.json({
      success: true,
      message: 'PayPal checkout initiated',
      paypalUrl,
      amount: amount,
      plan: plan,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'PayPal checkout failed. Please try again.',
      error: error.message 
    });
  }
});

// Get payment history
router.get('/history', verifyJWT, async (req, res) => {
  try {
    // In production, fetch from database
    const mockHistory = [
      {
        id: 'TXN123456789',
        method: 'M-Pesa',
        amount: 500,
        plan: 'Family Premium',
        status: 'completed',
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: 'CARD987654321',
        method: 'Credit Card',
        amount: 300,
        plan: 'Individual Premium',
        status: 'completed',
        date: '2024-01-01T14:20:00Z'
      }
    ];
    
    res.json({
      success: true,
      payments: mockHistory
    });
    
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message 
    });
  }
});

// Webhook for M-Pesa callbacks (for production)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    
    if (Body && Body.stkCallback) {
      const { ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
      
      if (ResultCode === 0) {
        // Payment successful
        console.log('M-Pesa payment successful:', CallbackMetadata);
        // Update database, send notifications, etc.
      } else {
        // Payment failed
        console.log('M-Pesa payment failed:', ResultDesc);
      }
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
