import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateResponse(messages: { role: string; content: string }[], conversationId?: string) {
  console.log('Generating response...');
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(conversationId && { 'x-conversation-id': conversationId }),
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate response');
  }

  return response.json();
}

export async function fetchConversation(conversationId: string) {
  console.log('Fetching conversation history...');
  const response = await fetch(`/api/conversation?id=${conversationId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch conversation');
  }

  return response.json();
}

export async function fetchConversations(page = 1, limit = 10) {
  console.log('Fetching conversations list...');
  const response = await fetch(`/api/conversations?page=${page}&limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch conversations list');
  }

  return response.json();
}
