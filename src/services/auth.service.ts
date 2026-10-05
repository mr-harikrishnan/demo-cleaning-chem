import { authStorage } from '../storage';
import { User } from '../types';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  getCurrentUser: (): User | null => {
    return authStorage.getCurrentUser();
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(200);
    try {
      return await authStorage.login(email, password);
    } catch (err: unknown) {
      console.error('Login error in authService:', err);
      const msg = err instanceof Error ? err.message : 'Unable to sign in. Please verify your credentials.';
      throw new Error(msg);
    }
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): Promise<User> => {
    await delay(200);
    try {
      return await authStorage.register(data);
    } catch (err: unknown) {
      console.error('Registration error in authService:', err);
      const msg = err instanceof Error ? err.message : 'Unable to create account. Please check entered information.';
      throw new Error(msg);
    }
  },

  logout: async (): Promise<void> => {
    await delay(100);
    authStorage.clearSession();
  },

  updateProfile: async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(150);
    try {
      return await authStorage.updateProfile(id, updates);
    } catch (err: unknown) {
      console.error('Profile update error in authService:', err);
      throw new Error('Unable to update profile. Please try again.');
    }
  }
};
