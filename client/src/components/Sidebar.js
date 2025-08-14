import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KeyIcon, HomeIcon, Cog6ToothIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${isActive(path) 
      ? 'bg-teal/20 text-teal border-l-4 border-teal' 
      : 'text-softwhite/80 hover:text-teal hover:bg-teal/10'
    }
  `;

  return (
    <aside className="w-64 bg-navy/60 backdrop-blur-sm shadow-glass min-h-screen border-r border-teal/20">
      <div className="p-6">
        <nav className="space-y-2">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <HomeIcon className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link to="/vault" className={linkClass('/vault')}>
            <KeyIcon className="h-5 w-5" />
            <span className="font-medium">Password Vault</span>
          </Link>
          
          <Link 
            to="/vault/new" 
            className="flex items-center gap-3 px-4 py-2 mt-2 text-sm bg-teal text-navy rounded-lg hover:bg-teal/90 transition-colors font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Password
          </Link>
          
          <div className="pt-4 border-t border-teal/20 mt-6">
            <Link to="/premium" className={linkClass('/premium')}>
              <StarIcon className="h-5 w-5" />
              <span className="font-medium">Premium Features</span>
            </Link>
            
            <Link to="/settings" className={linkClass('/settings')}>
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </nav>
        
        <div className="mt-8 p-4 bg-teal/10 rounded-lg border border-teal/20">
          <h3 className="text-sm font-semibold text-teal mb-2">Security Tip</h3>
          <p className="text-xs text-softwhite/70">
            Use strong, unique passwords for each account. Enable 2FA when available.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
