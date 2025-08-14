import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  KeyIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPasswords: 0,
    weakPasswords: 0,
    reusedPasswords: 0,
    strongPasswords: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/vault');
      const items = response.data;
      
      setStats({
        totalPasswords: items.length,
        weakPasswords: Math.floor(items.length * 0.2), // Mock calculation
        reusedPasswords: Math.floor(items.length * 0.1), // Mock calculation
        strongPasswords: Math.floor(items.length * 0.7) // Mock calculation
      });
      
      setRecentItems(items.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = () => {
    if (stats.totalPasswords === 0) return 0;
    return Math.round((stats.strongPasswords / stats.totalPasswords) * 100);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-softwhite">Loading dashboard...</div>
      </div>
    );
  }

  const healthScore = getHealthScore();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass p-6 rounded-2xl">
        <h1 className="text-3xl font-bold text-teal mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-softwhite/70">
          Here's your password security overview and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-softwhite/70 text-sm">Total Passwords</p>
              <p className="text-2xl font-bold text-teal">{stats.totalPasswords}</p>
            </div>
            <KeyIcon className="h-8 w-8 text-teal/60" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-softwhite/70 text-sm">Strong Passwords</p>
              <p className="text-2xl font-bold text-green-500">{stats.strongPasswords}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-green-500/60" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-softwhite/70 text-sm">Weak Passwords</p>
              <p className="text-2xl font-bold text-red-500">{stats.weakPasswords}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500/60" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-softwhite/70 text-sm">Security Score</p>
              <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}%
              </p>
            </div>
            <div className={`h-8 w-8 rounded-full ${getHealthBgColor(healthScore)}/20 flex items-center justify-center`}>
              <div className={`h-4 w-4 rounded-full ${getHealthBgColor(healthScore)}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Password Health Meter */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-teal mb-4">Password Health</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-softwhite">Overall Security Score</span>
            <span className={`font-semibold ${getHealthColor(healthScore)}`}>
              {healthScore}%
            </span>
          </div>
          <div className="w-full bg-navy/50 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getHealthBgColor(healthScore)}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-500 font-semibold">{stats.strongPasswords}</div>
              <div className="text-softwhite/70">Strong</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-500 font-semibold">{stats.reusedPasswords}</div>
              <div className="text-softwhite/70">Reused</div>
            </div>
            <div className="text-center">
              <div className="text-red-500 font-semibold">{stats.weakPasswords}</div>
              <div className="text-softwhite/70">Weak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-teal">Recent Items</h3>
            <Link to="/vault" className="text-sm text-teal hover:text-teal/80">
              View All
            </Link>
          </div>
          {recentItems.length > 0 ? (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-navy/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="h-5 w-5 text-teal/60" />
                    <div>
                      <div className="font-medium text-softwhite">{item.service}</div>
                      <div className="text-sm text-softwhite/60">{item.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-softwhite/50">
                    <ClockIcon className="h-4 w-4" />
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-softwhite/50">
              <KeyIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No passwords saved yet.</p>
              <Link to="/vault/new" className="text-teal hover:text-teal/80 text-sm">
                Add your first password
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-teal mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/vault/new"
              className="flex items-center gap-3 p-4 bg-teal/10 hover:bg-teal/20 rounded-lg border border-teal/20 transition-colors group"
            >
              <PlusIcon className="h-6 w-6 text-teal" />
              <div>
                <div className="font-medium text-teal group-hover:text-teal/80">Add New Password</div>
                <div className="text-sm text-softwhite/60">Securely store a new credential</div>
              </div>
            </Link>
            
            <Link
              to="/vault"
              className="flex items-center gap-3 p-4 bg-navy/30 hover:bg-navy/50 rounded-lg transition-colors group"
            >
              <EyeIcon className="h-6 w-6 text-softwhite/60" />
              <div>
                <div className="font-medium text-softwhite group-hover:text-teal">View All Passwords</div>
                <div className="text-sm text-softwhite/60">Browse your password vault</div>
              </div>
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center gap-3 p-4 bg-navy/30 hover:bg-navy/50 rounded-lg transition-colors group"
            >
              <ShieldCheckIcon className="h-6 w-6 text-softwhite/60" />
              <div>
                <div className="font-medium text-softwhite group-hover:text-teal">Security Settings</div>
                <div className="text-sm text-softwhite/60">Manage your account security</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
