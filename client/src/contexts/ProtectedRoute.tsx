import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
