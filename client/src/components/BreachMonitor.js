import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  EyeIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const BreachMonitor = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());
  const [breaches, setBreaches] = useState([]);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    compromisedAccounts: 0,
    lastBreachDate: null,
    riskLevel: 'low'
  });

  // Mock breach data
  const mockBreaches = [
    {
      id: 1,
      service: 'Adobe',
      date: '2024-01-15',
      severity: 'high',
      affectedData: ['Email', 'Password', 'Name'],
      accountsAffected: '38M',
      description: 'Customer data including encrypted passwords was compromised',
      action: 'Change password immediately',
      status: 'unresolved'
    },
    {
      id: 2,
      service: 'Facebook',
      date: '2024-02-08',
      severity: 'medium', 
      affectedData: ['Email', 'Phone'],
      accountsAffected: '533M',
      description: 'Personal information was scraped and made public',
      action: 'Review privacy settings',
      status: 'acknowledged'
    },
    {
      id: 3,
      service: 'LinkedIn',
      date: '2024-03-12',
      severity: 'low',
      affectedData: ['Email'],
      affectedData: '700M',
      description: 'Email addresses were found in a public database',
      action: 'Monitor for spam',
      status: 'resolved'
    }
  ];

  const performScan = async () => {
    setIsScanning(true);
    
    try {
      // Simulate API call to check for breaches
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results
      setBreaches(mockBreaches);
      setStats({
        totalAccounts: 127,
        compromisedAccounts: 15,
        lastBreachDate: '2024-03-12',
        riskLevel: mockBreaches.filter(b => b.severity === 'high').length > 0 ? 'high' : 
                   mockBreaches.filter(b => b.severity === 'medium').length > 0 ? 'medium' : 'low'
      });
      setLastScan(new Date());
      
    } catch (error) {
      console.error('Breach scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Auto-scan on component mount
    performScan();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Breach Monitoring</h3>
          <p className="text-gray-400 text-sm">
            We continuously monitor the dark web for your compromised accounts
          </p>
        </div>
        <motion.button
          onClick={performScan}
          disabled={isScanning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Now'}
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <EyeIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalAccounts}</p>
              <p className="text-sm text-gray-400">Accounts Monitored</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.compromisedAccounts}</p>
              <p className="text-sm text-gray-400">Compromised</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stats.riskLevel === 'high' ? 'bg-red-500/20' : stats.riskLevel === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
              <ShieldCheckIcon className={`w-5 h-5 ${getRiskLevelColor(stats.riskLevel)}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold capitalize ${getRiskLevelColor(stats.riskLevel)}`}>
                {stats.riskLevel}
              </p>
              <p className="text-sm text-gray-400">Risk Level</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Last Scan Info */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <ClockIcon className="w-4 h-4" />
        Last scan: {lastScan.toLocaleString()}
      </div>

      {/* Breach List */}
      {isScanning ? (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <ArrowPathIcon className="w-8 h-8 text-blue-400" />
          </motion.div>
          <p className="text-white mt-4 font-medium">Scanning for breaches...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Recent Breaches</h4>
          {breaches.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
              <ShieldCheckIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-white font-medium">Great news!</p>
              <p className="text-gray-400 text-sm">No breaches found for your accounts</p>
            </div>
          ) : (
            breaches.map((breach, index) => (
              <motion.div
                key={breach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(breach.severity).split(' ')[1]}`}>
                      <ExclamationTriangleIcon className={`w-5 h-5 ${getSeverityColor(breach.severity).split(' ')[0]}`} />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">{breach.service}</h5>
                      <p className="text-gray-400 text-sm">{breach.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(breach.severity)}`}>
                    {breach.severity} risk
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{breach.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    <span className="font-medium text-white">{breach.accountsAffected}</span> accounts affected
                  </div>
                  <div className="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors">
                    {breach.action}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  {breach.affectedData.map((data, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                      {data}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BreachMonitor;
