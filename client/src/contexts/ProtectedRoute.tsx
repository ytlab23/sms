import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';
import { db } from '../firebase/config'; // Import Firestore db
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

interface AdminProtectedRouteProps {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const adminsDoc = await getDoc(doc(db, 'admins', 'admins'));
          if (adminsDoc.exists()) {
            const adminData = adminsDoc.data();
            if (adminData) {
              const normalizedEmail = currentUser.email?.trim().toLowerCase() || '';
              const adminEmails = Object.keys(adminData).map(email => email.trim().toLowerCase());
              setIsAdmin(adminEmails.includes(normalizedEmail));
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAdminLoading(false);
    };

    checkAdminStatus();
  }, [currentUser]);

  if (loading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (!isAdmin) {
    return <Navigate to="/sms" />;
  }

  return children;
};

export default AdminProtectedRoute;
