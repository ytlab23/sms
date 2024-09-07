
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase/config'; 

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Logout function
  const handleLogout = () => {
    //redirect to sign in after logout to /auth/signin
    


    signOut(auth)
      .then(() => {
        // Successfully logged out
        setCurrentUser(null);
        console.log('User logged out');
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
