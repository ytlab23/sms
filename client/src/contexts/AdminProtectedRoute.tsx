
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
  const { currentUser, loading } = useAuth(); // Get the current user from AuthContext
  const location = useLocation(); // To maintain the current route for redirection

  // Check if loading
  if (loading) {
    return <div>Loading...</div>; // Show loading while checking auth
  }

  // Check if the user is authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} />; // Redirect to sign-in if user is not logged in
  }

  // Check if the user is an admin
  const isAdmin = isAdminEmail(currentUser.email);

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} />; // Redirect if user is not an admin
  }

  return children; // Render admin-protected content if user is an admin
};

export default AdminProtectedRoute;
