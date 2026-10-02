import type { UserProfile } from '@/types';
import { mockUser } from '../mock/mockData';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(email: string, _password: string): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 800));
  const user: UserProfile = { ...mockUser, email };
  localStorage.setItem(TOKEN_KEY, `mock-token-${Date.now()}`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function signup(name: string, email: string, _password: string): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 800));
  const user: UserProfile = {
    ...mockUser,
    id: `u-${Date.now()}`,
    name,
    email,
    joinedAt: new Date().toISOString().split('T')[0],
    streak: 0,
  };
  localStorage.setItem(TOKEN_KEY, `mock-token-${Date.now()}`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): UserProfile | null {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export async function loginWithGoogle(): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 800));
  const user: UserProfile = { ...mockUser, email: 'alex.google@example.com' };
  localStorage.setItem(TOKEN_KEY, `mock-token-${Date.now()}`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}
