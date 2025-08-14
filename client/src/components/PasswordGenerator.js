import React, { useState } from 'react';
import { useClipboard } from '../hooks/useClipboard';
import { 
  ClipboardIcon, 
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function PasswordGenerator({ onPasswordGenerated }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const { copied, copy } = useClipboard();

  const generatePassword = () => {
    let chars = '';
    
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }
    
    if (!chars) {
      alert('Please select at least one character type');
      return;
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setPassword(result);
    if (onPasswordGenerated) {
      onPasswordGenerated(result);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: 'No password', color: 'text-gray-500' };
    
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strength = Math.min(Math.round((score / 6) * 100), 100);
    
    let text, color;
    if (strength < 40) {
      text = 'Weak';
      color = 'text-red-500';
    } else if (strength < 70) {
      text = 'Good';
      color = 'text-yellow-500';
    } else {
      text = 'Strong';
      color = 'text-green-500';
    }
    
    return { strength, text, color };
  };

  const strengthInfo = getPasswordStrength();

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-teal mb-4">Password Generator</h3>
      
      {/* Generated Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-softwhite mb-2">
          Generated Password
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-navy/50 border border-teal/30 rounded-lg font-mono text-sm text-softwhite break-all">
            {password || 'Click generate to create a password'}
          </div>
          <button
            onClick={() => copy(password)}
            disabled={!password}
            className="p-3 bg-teal/20 hover:bg-teal/30 border border-teal/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy password"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-teal" />
            )}
          </button>
          <button
            onClick={generatePassword}
            className="p-3 bg-teal hover:bg-teal/90 text-navy rounded-lg transition-colors"
            title="Generate new password"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Password Strength */}
        {password && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-softwhite/70">Strength</span>
              <span className={`text-sm font-medium ${strengthInfo.color}`}>
                {strengthInfo.text} ({strengthInfo.strength}%)
              </span>
            </div>
            <div className="w-full bg-navy/50 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  strengthInfo.strength < 40 ? 'bg-red-500' :
                  strengthInfo.strength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${strengthInfo.strength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Length Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-softwhite mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-navy/50 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-softwhite/50 mt-1">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-softwhite">Uppercase Letters (A-Z)</label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 text-teal bg-navy/50 border-teal/30 rounded focus:ring-teal/20 focus:ring-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-softwhite">Lowercase Letters (a-z)</label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 text-teal bg-navy/50 border-teal/30 rounded focus:ring-teal/20 focus:ring-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-softwhite">Numbers (0-9)</label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-teal bg-navy/50 border-teal/30 rounded focus:ring-teal/20 focus:ring-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-softwhite">Symbols (!@#$%^&*)</label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-teal bg-navy/50 border-teal/30 rounded focus:ring-teal/20 focus:ring-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-softwhite">Exclude Similar Characters (il1Lo0O)</label>
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="w-4 h-4 text-teal bg-navy/50 border-teal/30 rounded focus:ring-teal/20 focus:ring-2"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full mt-6 bg-teal text-navy font-semibold py-3 rounded-lg hover:bg-teal/90 transition-colors"
      >
        Generate Password
      </button>
    </div>
  );
}

export default PasswordGenerator;
