import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateStreamResponse(
  messages: { role: string; content: string }[], 
  onChunk: (chunk: {content: string, conversationId: string}) => void,
  conversationId?: string
) {
  console.log('Generating streaming response...');
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

  if (!response.body) {
    throw new Error('Response body is null');
  }

  let receivedConversationId: string | null = null;
  
  // Create a reader for the stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk
      const chunkText = decoder.decode(value);
      
      // Split by newlines to handle multiple JSON objects in a single chunk
      const lines = chunkText.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        try {
          const chunk = JSON.parse(line);
          
          // Keep track of the conversation ID from the first chunk
          if (chunk.conversationId && !receivedConversationId) {
            receivedConversationId = chunk.conversationId;
          }
          
          // Pass the chunk to the callback
          onChunk(chunk);
        } catch (e) {
          console.error('Error parsing chunk:', e, line);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  
  return { conversationId: receivedConversationId };
}

export async function generateResponse(messages: { role: string; content: string }[], conversationId?: string) {
  console.log('Generating response (non-streaming)...');
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
