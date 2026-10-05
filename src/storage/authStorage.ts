import { User } from '../types';
import { getData, removeData, setData, STORAGE_KEYS, updateData } from './storageCore';

export interface StoredUser extends User {
  passwordHash: string;
}

export const authStorage = {
  getUsers: (): StoredUser[] => {
    return getData<StoredUser[]>(STORAGE_KEYS.USERS, []);
  },

  getCurrentUser: (): User | null => {
    return getData<User | null>(STORAGE_KEYS.SESSION, null);
  },

  setSession: (user: User): void => {
    setData(STORAGE_KEYS.SESSION, user);
  },

  clearSession: (): void => {
    removeData(STORAGE_KEYS.SESSION);
  },

  login: async (email: string, password: string): Promise<User> => {
    // 1. Presence check
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    // 2. Format check
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    // 3. Domain / user lookup check
    const users = authStorage.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      throw new Error('Account not found with this email. Please check your credentials.');
    }

    if (found.passwordHash !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    // Strip password hash from session
    const { passwordHash: _, ...safeUser } = found;
    authStorage.setSession(safeUser);
    return safeUser;
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
    // 1. Presence check
    if (!data.name || !data.email || !data.password) {
      throw new Error('Full Name, Email and Password are required.');
    }

    // 2. Format check
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!trimmedEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // 3. Existing user check
    const users = authStorage.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      throw new Error('An account already exists with this email address.');
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      role: 'customer',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || 'Chennai',
      state: data.state || 'Tamil Nadu',
      pincode: data.pincode || '',
      passwordHash: data.password,
      createdAt: new Date().toISOString()
    };

    updateData<StoredUser[]>(STORAGE_KEYS.USERS, (prev) => [...prev, newUser], []);

    const { passwordHash: _, ...safeUser } = newUser;
    authStorage.setSession(safeUser);
    return safeUser;
  },

  updateProfile: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!id) {
      throw new Error('User ID is required to update profile.');
    }

    let updatedUser: User | null = null;
    updateData<StoredUser[]>(
      STORAGE_KEYS.USERS,
      (prev) => {
        return prev.map((u) => {
          if (u.id === id) {
            const next = { ...u, ...updates };
            const { passwordHash: _, ...safe } = next;
            updatedUser = safe;
            return next;
          }
          return u;
        });
      },
      []
    );

    if (updatedUser) {
      const current = authStorage.getCurrentUser();
      if (current && current.id === id) {
        authStorage.setSession(updatedUser);
      }
      return updatedUser;
    }

    throw new Error('User account not found.');
  }
};
