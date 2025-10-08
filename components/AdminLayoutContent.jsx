'use client';

import Sidebar from "./Sidebar";

export default function AdminLayoutContent({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('masterAdminAuth');
    window.location.reload();
  };

  const getAdminData = () => {
    try {
      const authData = localStorage.getItem('masterAdminAuth');
      return authData ? JSON.parse(authData).admin : null;
    } catch {
      
      return null;
    }
  };

  return (
    <>
      <Sidebar logout={handleLogout} adminData={getAdminData()} />
      {children}
    </>
  );
}