import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { passwordStrength } from '../utils/passwordStrength';
import { sendOTPEmailMock } from '../utils/emailService';
import { motion } from 'framer-motion';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleEmails, setShowGoogleEmails] = useState(false);
  const [googleEmails, setGoogleEmails] = useState([]);
  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordCheck = password ? passwordStrength(password) : null;

  // Mock Google emails for demonstration
  const mockGoogleEmails = [
    { email: 'john.doe@gmail.com', name: 'John Doe', avatar: 'JD' },
    { email: 'johndoe.work@gmail.com', name: 'John Doe (Work)', avatar: 'JW' },
    { email: 'john.doe.personal@gmail.com', name: 'John Doe (Personal)', avatar: 'JP' }
  ];

  const handleGoogleSignUp = async () => {
    setLoading(true);
    
    try {
      // Use the new mock Google authentication
      const response = await fetch('http://localhost:5000/api/auth/mock-google', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user${Date.now()}@gmail.com`,
          name: 'Google User'
        })
      });
      
      if (response.ok) {
        setMessage('Account created successfully with Google!');
        setTimeout(() => window.location.href = '/dashboard', 1500);
      } else {
        setError('Google sign-up failed');
      }
    } catch (error) {
      setError('Failed to connect to Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleEmailSelect = async (selectedEmail) => {
    setLoading(true);
    setShowGoogleEmails(false);
    
    try {
      // Auto-populate email
      setEmail(selectedEmail.email);
      
      // Generate a secure random password for Google OAuth users
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      setPassword(randomPassword);
      setConfirmPassword(randomPassword);
      
      // Register user with Google email
      await register(selectedEmail.email, randomPassword);
      
      // Skip OTP for Google OAuth users
      setOtpSent(false);
      setMessage(`Account created successfully with ${selectedEmail.email}!`);
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (error) {
      setError('Failed to create account with Google email');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      // Register the user
      await register(email, password);
      
      // Generate and send OTP using EmailJS
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const emailResult = await sendOTPEmailMock(email, otp);
      
      if (emailResult.success) {
        // Store OTP temporarily for verification
        localStorage.setItem('tempOTP', otp);
        localStorage.setItem('tempEmail', email);
        
        setOtpSent(true);
        setMessage('Registration successful! Check your email for the OTP code.');
      } else {
        setOtpSent(true);
        setMessage('Registration successful! You can login immediately.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Check OTP against stored value
      const storedOTP = localStorage.getItem('tempOTP');
      const storedEmail = localStorage.getItem('tempEmail');
      
      if (otp === storedOTP && email === storedEmail) {
        // Clear temporary storage
        localStorage.removeItem('tempOTP');
        localStorage.removeItem('tempEmail');
        
        setMessage('Email verified successfully! You can now login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Invalid or expired OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch(score) {
      case 0: return 'text-red-500';
      case 1: return 'text-orange-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-blue-500';
      case 4: return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPasswordStrengthText = (score) => {
    switch(score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy to-slate-900">
      <div className="max-w-md w-full mx-4">
        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal mb-2">Create Account</h1>
            <p className="text-softwhite/70">
              {otpSent ? 'Verify your email address' : 'Join CipherNest today'}
            </p>
          </div>
          
          {!otpSent ? (
            <>
              {/* Google Sign Up Section */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 p-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-navy text-gray-400">Or</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-navy/50 border border-teal/30 text-softwhite placeholder-softwhite/50 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-12 rounded-lg bg-navy/50 border border-teal/30 text-softwhite placeholder-softwhite/50 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softwhite/50 hover:text-teal transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordCheck && (
                  <div className="mt-2">
                    <div className={`text-sm ${getPasswordStrengthColor(passwordCheck.score)}`}>
                      Strength: {getPasswordStrengthText(passwordCheck.score)}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= passwordCheck.score ? getPasswordStrengthColor(passwordCheck.score).replace('text-', 'bg-') : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 pr-12 rounded-lg bg-navy/50 border border-teal/30 text-softwhite placeholder-softwhite/50 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softwhite/50 hover:text-teal transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="text-red-400 text-sm mt-1">Passwords do not match</div>
                )}
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || password !== confirmPassword}
                className="w-full bg-teal text-navy font-semibold py-3 rounded-lg hover:bg-teal/90 focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-lg bg-navy/50 border border-teal/30 text-softwhite placeholder-softwhite/50 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all text-center text-lg tracking-widest"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                />
                <p className="text-xs text-softwhite/60 mt-2 text-center">
                  We sent a verification code to {email}
                </p>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal text-navy font-semibold py-3 rounded-lg hover:bg-teal/90 focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}
          
          {message && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              {message}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-softwhite/70">
              Already have an account?{' '}
              <Link to="/login" className="text-teal hover:text-teal/80 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Google Email Selection Modal */}
      {showGoogleEmails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Choose your Google account</h2>
              <button
                onClick={() => setShowGoogleEmails(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {googleEmails.map((emailData, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleGoogleEmailSelect(emailData)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {emailData.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{emailData.name}</div>
                    <div className="text-gray-400 text-sm">{emailData.email}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Select the Gmail account you want to use for CipherNest
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Register;
