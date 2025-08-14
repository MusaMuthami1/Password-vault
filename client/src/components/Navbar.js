import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implement theme switching logic
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-navy/90 backdrop-blur-sm shadow-glass border-b border-teal/20">
      <Link to="/dashboard" className="text-2xl font-bold text-teal hover:text-teal/80 transition-colors">
        CipherNest
      </Link>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-softwhite/80">
          {user?.email}
        </span>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-teal/10 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-softwhite hover:text-teal transition-colors" />
          ) : (
            <MoonIcon className="h-5 w-5 text-softwhite hover:text-teal transition-colors" />
          )}
        </button>
        
        <Link 
          to="/premium" 
          className="text-sm text-softwhite hover:text-teal transition-colors"
        >
          Premium
        </Link>
        
        <Link 
          to="/settings" 
          className="text-sm text-softwhite hover:text-teal transition-colors"
        >
          Settings
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-softwhite hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
