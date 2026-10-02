import type { KnowledgeDocument, SearchResult } from '@/types';
import { mockDocuments, mockSearchResults } from '../mock/mockData';
import { apiRequest, USE_MOCK } from './client';

export async function getDocuments(): Promise<KnowledgeDocument[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return mockDocuments;
  }
  return apiRequest<KnowledgeDocument[]>('/api/knowledge');
}

export async function getDocument(id: string): Promise<KnowledgeDocument> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockDocuments.find((d) => d.id === id) || mockDocuments[0];
  }
  return apiRequest<KnowledgeDocument>(`/api/knowledge/${id}`);
}

export async function uploadDocument(file: { name: string; size: number; type: string }): Promise<{
  id: string;
  status: string;
}> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2000));
    return {
      id: `d-${Date.now()}`,
      status: 'ready',
    };
  }
  return apiRequest('/api/knowledge/upload', {
    method: 'POST',
    body: file,
  });
}

export async function deleteDocument(id: string): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  }
  return apiRequest(`/api/knowledge/${id}`, { method: 'DELETE' });
}

export async function searchKnowledge(query: string): Promise<SearchResult[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    if (!query.trim()) return [];
    return mockSearchResults.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }
  return apiRequest<SearchResult[]>(`/api/knowledge/search?q=${encodeURIComponent(query)}`);
}
