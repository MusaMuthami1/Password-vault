import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import VaultItemCard from '../components/VaultItemCard';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

function VaultList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    loadVaultItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, search, selectedTag]);

  const loadVaultItems = async () => {
    try {
      const response = await api.get('/vault');
      setItems(response.data);
      
      // Extract unique tags
      const tags = [...new Set(response.data.flatMap(item => item.tags || []))];
      setAllTags(tags);
    } catch (err) {
      setError('Failed to load vault items');
      console.error('Load vault items error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    
    if (search) {
      filtered = filtered.filter(item =>
        item.service.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(item => item.tags && item.tags.includes(selectedTag));
    }
    
    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) return;
    
    try {
      await api.delete(`/vault/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete item');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/vault/export/data');
      const data = JSON.stringify(response.data, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ciphernest-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export vault');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-softwhite">Loading your vault...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal mb-2">Password Vault</h1>
          <p className="text-softwhite/70">
            {filteredItems.length} of {items.length} passwords
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-navy/50 hover:bg-navy/70 text-softwhite rounded-lg border border-teal/30 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export
          </button>
          <Link
            to="/vault/new"
            className="flex items-center gap-2 px-6 py-2 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Password
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass p-4 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-softwhite/50" />
            <input
              type="text"
              placeholder="Search passwords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy/50 border border-teal/30 rounded-lg text-softwhite placeholder-softwhite/50 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-softwhite/50" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 bg-navy/50 border border-teal/30 rounded-lg text-softwhite focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Vault Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <VaultItemCard
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onRefresh={loadVaultItems}
            />
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-2xl text-center">
          {items.length === 0 ? (
            <div>
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-teal/10 flex items-center justify-center">
                <PlusIcon className="h-12 w-12 text-teal/50" />
              </div>
              <h3 className="text-xl font-semibold text-softwhite mb-2">No passwords yet</h3>
              <p className="text-softwhite/60 mb-6">
                Get started by adding your first password to CipherNest.
              </p>
              <Link
                to="/vault/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Your First Password
              </Link>
            </div>
          ) : (
            <div>
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-600/20 flex items-center justify-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-softwhite mb-2">No matches found</h3>
              <p className="text-softwhite/60 mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedTag('');
                }}
                className="text-teal hover:text-teal/80 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VaultList;
