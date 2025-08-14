import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  UserIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Profile form
  const [profileData, setProfileData] = useState({
    email: user?.email || ''
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Sessions
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (activeTab === 'security') {
      loadSecurityData();
    }
  }, [activeTab]);

  const loadSecurityData = async () => {
    try {
      // Mock for now - in real app would load from /api/user/security
      setTwoFactorEnabled(false);
      setSessions([
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'New York, NY',
          lastActive: '2 minutes ago',
          current: true
        },
        {
          id: 2,
          device: 'iPhone Safari',
          location: 'New York, NY', 
          lastActive: '1 day ago',
          current: false
        }
      ]);
    } catch (err) {
      console.error('Failed to load security data:', err);
    }
  };



  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await api.put('/user/me', profileData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      await api.put('/user/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const response = await api.put('/user/2fa');
      setTwoFactorEnabled(response.data.twoFactorEnabled);
      setMessage(response.data.twoFactorEnabled ? '2FA enabled' : '2FA disabled');
    } catch (err) {
      setError('Failed to toggle 2FA');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await api.delete(`/user/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      setMessage('Session deleted');
    } catch (err) {
      setError('Failed to delete session');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    const confirmText = window.prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      return;
    }
    
    try {
      await api.delete('/user/delete');
      await logout();
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'sessions', name: 'Sessions', icon: DevicePhoneMobileIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-teal mb-2">Settings</h1>
        <p className="text-softwhite/70">Manage your account and security preferences</p>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-teal/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-teal border-b-2 border-teal bg-teal/5'
                  : 'text-softwhite/70 hover:text-teal hover:bg-teal/5'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Messages */}
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full p-3 rounded-lg bg-navy/50 border border-teal/30 text-softwhite focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg bg-navy/50 border border-teal/30 text-softwhite focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softwhite/50 hover:text-teal"
                  >
                    {showPasswords.old ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg bg-navy/50 border border-teal/30 text-softwhite focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softwhite/50 hover:text-teal"
                  >
                    {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-softwhite mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg bg-navy/50 border border-teal/30 text-softwhite focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softwhite/50 hover:text-teal"
                  >
                    {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-navy/30 rounded-lg border border-teal/20">
                <div>
                  <h3 className="font-medium text-softwhite">Two-Factor Authentication</h3>
                  <p className="text-sm text-softwhite/60">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    twoFactorEnabled
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-teal/20 text-teal border border-teal/30 hover:bg-teal/30'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>
              
              <div className="border-t border-red-500/20 pt-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <h4 className="font-medium text-red-400 mb-2">Delete Account</h4>
                  <p className="text-sm text-softwhite/60 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-softwhite mb-2">Active Sessions</h3>
                <p className="text-sm text-softwhite/60">Manage your logged-in devices and sessions</p>
              </div>
              
              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-navy/30 rounded-lg border border-teal/20">
                      <div className="flex items-center gap-3">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-teal/60" />
                        <div>
                          <div className="font-medium text-softwhite">
                            {session.device || 'Unknown Device'}
                          </div>
                          <div className="text-sm text-softwhite/60">
                            {session.ip} • Last active: {new Date(session.lastActive).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="End session"
                      >
                        <TrashIcon className="h-4 w-4 text-softwhite/60 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-softwhite/50">
                  <DevicePhoneMobileIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active sessions found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
