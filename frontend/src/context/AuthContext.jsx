import { createContext, useContext, useEffect, useState } from 'react';
import { authStorage } from '../lib/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('token'); // legacy JWT from older backend
    setUser(authStorage.getUser());
    setLoading(false);
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    authStorage.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
