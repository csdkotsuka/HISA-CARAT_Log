import type { AuthUser } from '../types/auth';
import { DEMO_ACCOUNTS } from '../types/auth';

const CURRENT_USER_KEY = 'cheer_current_user_v1';

export const getCurrentUser = (): AuthUser => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Synchronize with updated DEMO_ACCOUNTS if this user is a demo user
      const matched = DEMO_ACCOUNTS.find((u) => u.id === parsed.id);
      if (matched) {
        return { ...matched, ...parsed };
      }
      return parsed;
    }
    // Default to Hisako's account for immediate delightful experience
    const defaultUser = DEMO_ACCOUNTS.find((u) => u.id === 'user-cust-hisa') || DEMO_ACCOUNTS[0];
    setCurrentUser(defaultUser);
    return defaultUser;
  } catch {
    return DEMO_ACCOUNTS[0];
  }
};

export const setCurrentUser = (user: AuthUser | null): void => {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to set current user:', e);
  }
};

export const findUserByEmail = (email: string): AuthUser | undefined => {
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === normalized);
};

export const loginWithEmail = (email: string): AuthUser => {
  const existing = findUserByEmail(email);
  if (existing) {
    setCurrentUser(existing);
    return existing;
  }

  // Create a new customer user on the fly if email not found
  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email: email.trim().toLowerCase(),
    name: email.split('@')[0],
    role: 'customer',
    tenantId: 'tenant-carat-hisa',
    customerId: 'cust-hisa-01',
    description: '一般メンバーアカウント',
  };
  setCurrentUser(newUser);
  return newUser;
};

export const logout = (): void => {
  setCurrentUser(null);
};
