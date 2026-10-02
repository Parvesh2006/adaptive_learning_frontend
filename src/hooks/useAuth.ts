import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/types';
import * as authService from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const u = await authService.login(email, password);
    setUser(u);
    setLoading(false);
    return u;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    const u = await authService.signup(name, email, password);
    setUser(u);
    setLoading(false);
    return u;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    const u = await authService.loginWithGoogle();
    setUser(u);
    setLoading(false);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, loginWithGoogle, logout, isAuthenticated: !!user };
}
