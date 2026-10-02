import type { ProgressAnalytics, RevisionItem } from '@/types';
import { mockProgress, mockRevisionItems } from '../mock/mockData';
import { apiRequest, USE_MOCK } from './client';

export async function getProgress(): Promise<ProgressAnalytics> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return mockProgress;
  }
  return apiRequest<ProgressAnalytics>('/api/progress');
}

export async function getTopicMastery(): Promise<{ topic: string; mastery: number }[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockProgress.topicMastery;
  }
  return apiRequest('/api/progress/topics');
}

export async function getAnalytics(range: string): Promise<ProgressAnalytics> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return mockProgress;
  }
  return apiRequest<ProgressAnalytics>(`/api/progress/analytics?range=${range}`);
}

export async function getRecommendations(): Promise<RevisionItem[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return mockRevisionItems;
  }
  return apiRequest<RevisionItem[]>('/api/revision');
}
