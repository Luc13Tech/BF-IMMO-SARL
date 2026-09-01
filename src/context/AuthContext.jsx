import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bfimmo_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setAdmin)
      .catch(() => localStorage.removeItem('bfimmo_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, admin: adminData } = await apiLogin(email, password);
    localStorage.setItem('bfimmo_admin_token', token);
    setAdmin(adminData);
    return adminData;
  }

  function logout() {
    localStorage.removeItem('bfimmo_admin_token');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
