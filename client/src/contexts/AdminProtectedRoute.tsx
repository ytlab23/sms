
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authcontext';

const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((email: string) => email.trim().toLowerCase());
  
  const normalizedEmail = email.trim().toLowerCase();
  
  return adminEmails?.includes(normalizedEmail) || false;
};

interface AdminProtectedRouteProps {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation(); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} />; 
  }

  const isAdmin = isAdminEmail(currentUser.email);

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} />; 
  }

  return children;
};

export default AdminProtectedRoute;
