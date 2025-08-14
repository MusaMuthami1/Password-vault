const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendOTP } = require('../utils/email');
const { generateOTP } = require('../utils/otp');
const { jwtRefreshSecret } = require('../config/keys');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    
    const hash = await bcrypt.hash(password, 12);
    
    // TEMPORARY: Auto-verify users (no email OTP needed)
    const user = await User.create({ 
      email, 
      password: hash,
      isVerified: true  // Skip email verification for now
    });
    
    // Try to send OTP but don't fail if email doesn't work
    try {
      const otp = generateOTP();
      user.otp = { code: otp, expires: new Date(Date.now() + 10*60*1000) };
      await user.save();
      await sendOTP(email, otp);
      res.status(201).json({ message: 'Registered successfully. OTP sent to email for verification.' });
    } catch (emailErr) {
      console.log('Email failed, but user created successfully');
      res.status(201).json({ message: 'Registered successfully. You can login immediately.' });
    }
  } catch (err) { 
    console.error('Register error:', err);
    next(err); 
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    // TEMPORARY: Skip email verification check
    // if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });
    
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    
    res.cookie('access_token', accessToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) { 
    console.error('Login error:', err);
    next(err); 
  }
};

exports.logout = (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Logged out successfully' });
};

exports.refreshToken = (req, res, next) => {
  const token = req.cookies['refresh_token'];
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  
  try {
    const payload = jwt.verify(token, jwtRefreshSecret);
    const accessToken = generateAccessToken({ id: payload.id });
    res.cookie('access_token', accessToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });
    res.json({ message: 'Token refreshed' });
  } catch (err) { 
    console.error('Refresh token error:', err);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.otp || user.otp.code !== otp || user.otp.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (err) { 
    console.error('Verify OTP error:', err);
    next(err); 
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });
    
    const otp = generateOTP();
    user.otp = { code: otp, expires: new Date(Date.now() + 10*60*1000) };
    await user.save();
    
    await sendOTP(email, otp);
    res.json({ message: 'Password reset OTP sent to email' });
  } catch (err) { 
    console.error('Forgot password error:', err);
    next(err); 
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.otp || user.otp.code !== otp || user.otp.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) { 
    console.error('Reset password error:', err);
    next(err); 
  }
};

// Mock Google OAuth (works immediately without Google Cloud setup)
exports.mockGoogleAuth = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with mock Google data
      const randomPassword = Math.random().toString(36);
      const hash = await bcrypt.hash(randomPassword, 12);
      
      user = await User.create({
        email,
        password: hash,
        isVerified: true,
        googleId: 'mock_' + Date.now() // Mock Google ID
      });
    }
    
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    
    res.cookie('access_token', accessToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      message: 'Mock Google login successful', 
      user: { id: user._id, email: user.email } 
    });
  } catch (err) {
    console.error('Mock Google auth error:', err);
    next(err);
  }
};

// GitHub OAuth callback handler
exports.githubCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    
    res.cookie('access_token', accessToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// Google OAuth callback handler
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    
    res.cookie('access_token', accessToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};
