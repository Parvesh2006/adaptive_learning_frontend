import type { Conversation, ConversationMessage, TutorResponse, SourceCitation } from '@/types';
import { mockConversations } from '../mock/mockData';
import { apiRequest, USE_MOCK } from './client';

export async function askTutor(
  conversationId: string,
  question: string
): Promise<TutorResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      answer: generateMockAnswer(question),
      citations: [
        {
          id: `cit-${Date.now()}-1`,
          title: 'Neural Networks Lecture 04',
          type: 'video',
          timestamp: '32:18',
          excerpt:
            'This concept is fundamental to understanding how neural networks learn from data. The key idea is to propagate information through the network...',
        },
        {
          id: `cit-${Date.now()}-2`,
          title: 'ML Textbook',
          type: 'pdf',
          page: 72,
          excerpt:
            'The algorithm computes the gradient of the loss function with respect to each weight, allowing the model to adjust its parameters iteratively...',
        },
      ],
      confidence: 0.92,
      suggestedActions: ['Explain more', 'Simplify', 'Give Example', 'Quiz Me'],
    };
  }
  return apiRequest<TutorResponse>('/api/tutor/ask', {
    method: 'POST',
    body: { conversationId, question },
  });
}

export async function getConversation(id: string): Promise<Conversation> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockConversations.find((c) => c.id === id) || mockConversations[0];
  }
  return apiRequest<Conversation>(`/api/tutor/conversation/${id}`);
}

export async function getConversationHistory(): Promise<Conversation[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockConversations;
  }
  return apiRequest<Conversation[]>('/api/tutor/conversations');
}

function generateMockAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('backprop')) {
    return 'Backpropagation is the algorithm used to train neural networks by computing the gradient of the loss function with respect to each weight. It works by applying the chain rule backward through the network: first, a forward pass computes the output and loss, then the error signal propagates backward through each layer, computing partial derivatives at each step. These gradients are then used by an optimizer (like SGD or Adam) to update the weights.';
  }
  if (q.includes('gradient') || q.includes('descent')) {
    return 'Gradient descent is an optimization algorithm that iteratively updates model parameters by moving in the direction of the negative gradient of the loss function. The learning rate controls the step size. Variants include stochastic gradient descent (SGD), mini-batch gradient descent, and adaptive methods like Adam that adjust the learning rate per parameter.';
  }
  if (q.includes('cnn') || q.includes('convolution')) {
    return 'A Convolutional Neural Network (CNN) is a type of deep learning model particularly effective for image data. It uses convolutional layers that apply learnable filters across the input to detect spatial patterns like edges and textures. Pooling layers reduce dimensionality, and fully connected layers at the end produce the final output.';
  }
  if (q.includes('transformer') || q.includes('attention')) {
    return 'Transformers are a neural network architecture based entirely on attention mechanisms, dispensing with recurrence. The self-attention mechanism allows each token to attend to all other tokens, capturing long-range dependencies. Multi-head attention runs several attention operations in parallel, enabling the model to focus on different aspects simultaneously.';
  }
  return `That is a great question. Based on your learning materials, here is what I can tell you: ${question} involves several key concepts that build on your existing knowledge. The fundamental idea connects to neural network training and optimization. Would you like me to break this down further or provide a specific example?`;
}

export { type ConversationMessage, type SourceCitation };
