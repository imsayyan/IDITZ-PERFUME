import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('noore_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('noore_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setAdminUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid token');
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setAdminUser(res.user);
    localStorage.setItem('noore_admin_token', res.token);
    localStorage.setItem('noore_admin_user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('noore_admin_token');
    localStorage.removeItem('noore_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, adminUser, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
