import type { AssessmentSession, AssessmentResult } from '@/types';
import { mockAssessmentSession, mockAssessmentResult } from '../mock/mockData';
import { apiRequest, USE_MOCK } from './client';

export async function startAssessment(topic?: string): Promise<AssessmentSession> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { ...mockAssessmentSession, id: `a-${Date.now()}`, answers: {} };
  }
  return apiRequest<AssessmentSession>('/api/assessment/start', {
    method: 'POST',
    body: { topic },
  });
}

export async function getQuestion(
  assessmentId: string,
  questionId: string
): Promise<AssessmentSession['questions'][0]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const q = mockAssessmentSession.questions.find((q) => q.id === questionId);
    if (!q) throw { status: 404, message: 'Question not found' };
    return q;
  }
  return apiRequest(`/api/assessment/${assessmentId}/question/${questionId}`);
}

export async function submitAnswer(
  assessmentId: string,
  questionId: string,
  optionId: string
): Promise<{ correct: boolean; difficultyAdjustment?: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    const question = mockAssessmentSession.questions.find((q) => q.id === questionId);
    const correct = question?.correctOptionId === optionId;
    return {
      correct,
      difficultyAdjustment: correct ? 'increased' : 'maintained',
    };
  }
  return apiRequest(`/api/assessment/${assessmentId}/answer`, {
    method: 'POST',
    body: { questionId, optionId },
  });
}

export async function getAssessmentResult(assessmentId: string): Promise<AssessmentResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return mockAssessmentResult;
  }
  return apiRequest<AssessmentResult>(`/api/assessment/${assessmentId}/result`);
}
