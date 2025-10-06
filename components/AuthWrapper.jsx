'use client';

import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const authData = localStorage.getItem('masterAdminAuth');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        const currentTime = Date.now();
        const authTime = parsedAuth.timestamp;
        
        // Check if authentication is less than 24 hours old
        const isValid = parsedAuth.isAuthenticated && 
                       (currentTime - authTime) < (24 * 60 * 60 * 1000); // 24 hours

        if (isValid) {
          setIsAuthenticated(true);
          setAdminData(parsedAuth.admin);
        } else {
          // Remove expired authentication
          localStorage.removeItem('masterAdminAuth');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('masterAdminAuth');
    }
    setLoading(false);
  };

  const handleLogin = (adminInfo) => {
    setIsAuthenticated(true);
    setAdminData(adminInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('masterAdminAuth');
    setIsAuthenticated(false);
    setAdminData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Simply return children when authenticated
  return children;
}