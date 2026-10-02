import { useState, useEffect, useCallback } from 'react';
import type { Conversation, ConversationMessage, SourceCitation } from '@/types';
import { getConversationHistory, getConversation, askTutor } from '@/services/api/tutorApi';

export function useTutor() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const data = await getConversationHistory();
    setConversations(data);
    if (data.length > 0) setActiveConversation(data[0]);
    setLoading(false);
  };

  const selectConversation = useCallback(async (id: string) => {
    setLoading(true);
    const conv = await getConversation(id);
    setActiveConversation(conv);
    setLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!activeConversation) return;
      setSending(true);

      const userMsg: ConversationMessage = {
        id: `m-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setActiveConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev
      );

      const response = await askTutor(activeConversation.id, question);

      const aiMsg: ConversationMessage = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions,
      };

      setActiveConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, aiMsg], lastMessage: response.answer.slice(0, 60) + '...' } : prev
      );

      setSending(false);
    },
    [activeConversation]
  );

  const newConversation = useCallback(() => {
    const conv: Conversation = {
      id: `c-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      lastMessage: '',
      timestamp: 'Now',
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversation(conv);
  }, []);

  return {
    conversations,
    activeConversation,
    loading,
    sending,
    selectConversation,
    sendMessage,
    newConversation,
  };
}

export { type SourceCitation };
