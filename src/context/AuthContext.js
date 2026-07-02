import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user]  = useState(() => JSON.parse(localStorage.getItem('tf_user') || 'null'));
  const [token] = useState(() => localStorage.getItem('tf_token'));

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('tf_token', data.token);
    localStorage.setItem('tf_user', JSON.stringify(data.user || { name: data.name, email: data.email, _id: data._id }));
    window.location.href = '/';
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    localStorage.setItem('tf_token', data.token);
    localStorage.setItem('tf_user', JSON.stringify(data.user || { name: data.name, email: data.email, _id: data._id }));
    window.location.href = '/';
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
