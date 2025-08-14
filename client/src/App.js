import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VaultList from './pages/VaultList';
import VaultItemForm from './pages/VaultItemForm';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="min-h-screen bg-navy text-softwhite flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="min-h-screen bg-navy text-softwhite flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

function AppContent() {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-navy text-softwhite">
      {user && <Navbar />}
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 p-4 ${!user ? 'w-full' : ''}`}>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vault" element={<ProtectedRoute><VaultList /></ProtectedRoute>} />
            <Route path="/vault/new" element={<ProtectedRoute><VaultItemForm /></ProtectedRoute>} />
            <Route path="/vault/edit/:id" element={<ProtectedRoute><VaultItemForm /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
            <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
