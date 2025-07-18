import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getProfile } from '../src/types/CheckUser'; 

const AdminProtectedRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const isAdminStatus = await getProfile();
        setIsAdmin(isAdminStatus);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAdmin(false);
      }
    };

    verifyUser();
  }, []); 

  if (isAdmin === null) {
    return <div>در حال بارگذاری...</div>; // می‌توانید از یک کامپوننت اسپینر استفاده کنید
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminProtectedRoute;