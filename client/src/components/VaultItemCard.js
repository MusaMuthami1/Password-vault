import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClipboard } from '../hooks/useClipboard';
import { passwordStrength } from '../utils/passwordStrength';
import { 
  ClipboardIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../utils/api';

function VaultItemCard({ item, onDelete, onRefresh }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const { copied, copy } = useClipboard();

  const handleViewPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      setPassword('');
      return;
    }

    setLoadingPassword(true);
    try {
      const response = await api.get(`/vault/${item._id}`);
      setPassword(response.data.password);
      setShowPassword(true);
    } catch (err) {
      console.error('Failed to fetch password:', err);
      alert('Failed to decrypt password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!password) {
      // Fetch password first if not already loaded
      try {
        const response = await api.get(`/vault/${item._id}`);
        await copy(response.data.password);
      } catch (err) {
        console.error('Failed to fetch password for copy:', err);
        alert('Failed to copy password');
      }
    } else {
      await copy(password);
    }
  };

  const handleCopyUsername = () => {
    copy(item.username);
  };

  const openWebsite = (e) => {
    e.stopPropagation();
    if (item.url) {
      window.open(item.url.startsWith('http') ? item.url : `https://${item.url}`, '_blank');
    }
  };

  const getPasswordStrength = () => {
    if (!password && !showPassword) return null;
    return passwordStrength(password || item.password);
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

  const getPasswordAge = () => {
    if (!item.lastPasswordChange && !item.createdAt) return null;
    const changeDate = new Date(item.lastPasswordChange || item.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - changeDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      return { text: `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} old`, color: 'text-red-500' };
    } else if (diffDays > 90) {
      return { text: `${Math.floor(diffDays / 30)} months old`, color: 'text-yellow-500' };
    } else {
      return { text: `${diffDays} days old`, color: 'text-green-500' };
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Banking': return '🏦';
      case 'Social Media': return '📱';
      case 'Email': return '📧';
      case 'Work': return '💼';
      case 'Shopping': return '🛒';
      case 'Gaming': return '🎮';
      case 'Credit Card': return '💳';
      default: return '🌐';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const passwordCheck = getPasswordStrength();
  const passwordAge = getPasswordAge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-200 border border-teal/10 hover:border-teal/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getCategoryIcon(item.category)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-teal">{item.service}</h3>
              {item.favorite && <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-softwhite/80">{item.username}</span>
              <button
                onClick={handleCopyUsername}
                className="p-1 hover:bg-teal/10 rounded transition-colors"
                title="Copy username"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-4 w-4 text-softwhite/50 hover:text-teal" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {item.url && (
            <button
              onClick={openWebsite}
              className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
              title="Open website"
            >
              <GlobeAltIcon className="h-4 w-4 text-softwhite/60 hover:text-teal" />
            </button>
          )}
          <Link
            to={`/vault/edit/${item._id}`}
            className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4 text-softwhite/60 hover:text-teal" />
          </Link>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4 text-softwhite/60 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Security Status */}
      <div className="flex items-center gap-4 mb-3">
        {passwordCheck && (
          <div className="flex items-center gap-2">
            {passwordCheck.score >= 3 ? (
              <ShieldCheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
            )}
            <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordCheck.score)}`}>
              {passwordCheck.score >= 3 ? 'Strong' : 'Weak'}
            </span>
          </div>
        )}
        
        {passwordAge && (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-softwhite/60" />
            <span className={`text-xs ${passwordAge.color}`}>
              {passwordAge.text}
            </span>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-softwhite/70">Password</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyPassword}
              className="p-1 hover:bg-teal/10 rounded transition-colors"
              title="Copy password"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardIcon className="h-4 w-4 text-softwhite/50 hover:text-teal" />
              )}
            </button>
            <button
              onClick={handleViewPassword}
              disabled={loadingPassword}
              className="p-1 hover:bg-teal/10 rounded transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {loadingPassword ? (
                <div className="h-4 w-4 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
              ) : showPassword ? (
                <EyeSlashIcon className="h-4 w-4 text-softwhite/50 hover:text-teal" />
              ) : (
                <EyeIcon className="h-4 w-4 text-softwhite/50 hover:text-teal" />
              )}
            </button>
          </div>
        </div>
        <div className="p-3 bg-navy/30 rounded-lg border border-teal/20">
          {showPassword ? (
            <span className="font-mono text-sm text-softwhite">{password}</span>
          ) : (
            <span className="text-softwhite/50">••••••••••••</span>
          )}
        </div>
        
        {/* Password Strength Indicator */}
        {passwordCheck && showPassword && (
          <div className="mt-2">
            <div className="flex gap-1">
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

      {/* Custom Fields */}
      {item.customFields && item.customFields.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-softwhite/70 block mb-2">Custom Fields</span>
          <div className="space-y-2">
            {item.customFields.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-navy/30 rounded-lg border border-teal/10">
                <div>
                  <div className="text-xs text-softwhite/60">{field.name}</div>
                  <div className="text-sm text-softwhite">
                    {field.type === 'password' ? '••••••••' : field.value}
                  </div>
                </div>
                <button
                  onClick={() => copy(field.value)}
                  className="p-1 hover:bg-teal/10 rounded transition-colors"
                  title="Copy field"
                >
                  {copied ? (
                    <CheckIcon className="h-3 w-3 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-3 w-3 text-softwhite/50 hover:text-teal" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div className="mb-4">
          <span className="text-sm text-softwhite/70 block mb-1">Notes</span>
          <p className="text-sm text-softwhite/80 bg-navy/20 p-2 rounded border border-teal/10">
            {item.notes}
          </p>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="h-4 w-4 text-softwhite/60" />
            <span className="text-xs font-medium text-softwhite/60">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-teal/20 text-teal rounded-full border border-teal/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-teal/10">
        <div className="flex justify-between items-center text-xs text-softwhite/50">
          <span>Created: {formatDate(item.createdAt)}</span>
          <div className="flex items-center gap-3">
            {item.updatedAt !== item.createdAt && (
              <span>Updated: {formatDate(item.updatedAt)}</span>
            )}
            {/* Security Score */}
            {passwordCheck && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  passwordCheck.score >= 3 ? 'bg-green-500' : passwordCheck.score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-softwhite/60">
                  {passwordCheck.score >= 3 ? 'Secure' : passwordCheck.score >= 2 ? 'Fair' : 'Vulnerable'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VaultItemCard;
