import React, { createContext, useContext, useState } from 'react';
import authService, { type User, type LoginResponse } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (res: LoginResponse) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authService.getStoredUser());

  const login = (res: LoginResponse) => {
    authService.storeSession(res);
    setUser(res.user);
    setIsAuthenticated(true);
  };

  const updateUser = (newData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...newData };
    setUser(updated);
    // Also update storage so refreshes keep the new data
    const session = authService.getStoredSession();
    if (session) {
      session.user = updated;
      authService.storeSession(session);
    }
  };

  const logout = () => {
    authService.clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
