import type { UserProfile, LearningPreferences } from '@/types';
import { mockUser } from '../mock/mockData';
import { apiRequest, USE_MOCK } from './client';

export async function getProfile(): Promise<UserProfile> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const stored = localStorage.getItem('user_profile');
    if (stored) return JSON.parse(stored);
    return mockUser;
  }
  return apiRequest<UserProfile>('/api/user/profile');
}

export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const updated = { ...mockUser, ...updates };
    localStorage.setItem('user_profile', JSON.stringify(updated));
    return updated;
  }
  return apiRequest<UserProfile>('/api/user/profile', {
    method: 'PUT',
    body: updates,
  });
}

export async function getLearningPreferences(): Promise<LearningPreferences> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      explanationStyle: 'simplified',
      pace: 'medium',
      dailyReminder: true,
      emailNotifications: false,
      theme: 'light',
    };
  }
  return apiRequest<LearningPreferences>('/api/user/preferences');
}

export async function updateLearningPreferences(
  updates: Partial<LearningPreferences>
): Promise<LearningPreferences> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      explanationStyle: 'simplified',
      pace: 'medium',
      dailyReminder: true,
      emailNotifications: false,
      theme: 'light',
      ...updates,
    };
  }
  return apiRequest<LearningPreferences>('/api/user/preferences', {
    method: 'PUT',
    body: updates,
  });
}
