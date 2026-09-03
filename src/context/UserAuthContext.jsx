import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  getUserMe,
  getUserFavorites,
  toggleUserFavorite,
} from '../api/client';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // tableau de biens (objets)
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(() => {
    getUserFavorites()
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('bfimmo_user_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getUserMe()
      .then((u) => {
        setUser(u);
        loadFavorites();
      })
      .catch(() => localStorage.removeItem('bfimmo_user_token'))
      .finally(() => setLoading(false));
  }, [loadFavorites]);

  async function login(email, password) {
    const { token, user: userData } = await loginUser(email, password);
    localStorage.setItem('bfimmo_user_token', token);
    setUser(userData);
    loadFavorites();
    return userData;
  }

  async function register(payload) {
    const { token, user: userData } = await registerUser(payload);
    localStorage.setItem('bfimmo_user_token', token);
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem('bfimmo_user_token');
    setUser(null);
    setFavorites([]);
  }

  const isFavorite = useCallback(
    (propertyId) => favorites.some((f) => f._id === propertyId),
    [favorites]
  );

  async function toggleFavorite(property) {
    if (!user) return { requiresAuth: true };
    // mise à jour optimiste
    const already = isFavorite(property._id);
    setFavorites((list) =>
      already ? list.filter((f) => f._id !== property._id) : [...list, property]
    );
    try {
      await toggleUserFavorite(property._id);
    } catch (err) {
      // on annule l'optimisme en cas d'échec
      loadFavorites();
      throw err;
    }
    return { requiresAuth: false };
  }

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth doit être utilisé dans un UserAuthProvider');
  return ctx;
}
