const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/otp', authController.verifyOTP);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

// Mock Google OAuth (works immediately - no setup needed)
router.post('/mock-google', authController.mockGoogleAuth);

// GitHub OAuth routes (easier alternative to Google)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  authController.githubCallback
);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  authController.googleCallback
);

module.exports = router;
