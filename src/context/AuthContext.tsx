import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsAdminDirect: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'zulfiqareee@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dbl_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default logged in sample reader for immediate seamless checkout experience
    return {
      uid: 'user_dhaka_01',
      email: 'reader.bangla@gmail.com',
      displayName: 'তানভীর আহমেদ (Tanvir Ahmed)',
      role: 'user',
      phone: '01712345678'
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dbl_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dbl_user');
    }
  }, [user]);

  const isAdmin = user?.email === ADMIN_EMAIL || user?.role === 'admin';

  const loginWithGoogle = async () => {
    setIsLoading(true);
    // Simulating authenticated login or connecting to Firebase Auth
    setTimeout(() => {
      setUser({
        uid: 'user_google_' + Date.now().toString().slice(-5),
        email: 'reader.google@gmail.com',
        displayName: 'সৌমেন চক্রবর্তী (Soumen)',
        role: 'user',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soumen'
      });
      setIsLoading(false);
    }, 400);
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const isAdm = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      setUser({
        uid: isAdm ? 'admin_zulfiqar_01' : 'user_' + Date.now().toString().slice(-5),
        email,
        displayName: isAdm ? 'Zulfiqar (Administrator)' : email.split('@')[0],
        role: isAdm ? 'admin' : 'user'
      });
      setIsLoading(false);
    }, 400);
  };

  const loginAsAdminDirect = () => {
    setUser({
      uid: 'admin_zulfiqar_01',
      email: ADMIN_EMAIL,
      displayName: 'Zulfiqar (Authorized Admin)',
      role: 'admin'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        loginAsAdminDirect,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
