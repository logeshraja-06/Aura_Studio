import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getMeApi } from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('aura_admin_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aura_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Silent token verification on app load
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('aura_admin_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('aura_admin_user', JSON.stringify(res.data));
          } else {
            logout();
          }
        } catch (err) {
          console.warn('JWT session verification failed:', err.message);
          logout();
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aura_admin_token', res.data.token);
      localStorage.setItem('aura_admin_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    throw new Error(res.message || 'Authentication failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aura_admin_token');
    localStorage.removeItem('aura_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
