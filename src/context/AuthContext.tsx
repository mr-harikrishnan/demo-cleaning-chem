import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';
import { subscribeToStorage } from '../storage';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);

    // Sync across tabs / events
    const unsubscribe = subscribeToStorage((key) => {
      if (key === 'cleantec_session') {
        setCurrentUser(authService.getCurrentUser());
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): Promise<User> => {
    const user = await authService.register(data);
    setCurrentUser(user);
    return user;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('No user is currently signed in.');
    const updated = await authService.updateProfile(currentUser.id, updates);
    setCurrentUser(updated);
    return updated;
  };

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
