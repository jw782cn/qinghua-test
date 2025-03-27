"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateResponse } from '@/lib/utils';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to the UI
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call the API to generate a response
      const allMessages = [...messages, userMessage];
      const response = await generateResponse(allMessages, conversationId);
      
      // Add the assistant's response to the UI
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: response.message.content || '' }
      ]);
      
      // Save the conversation ID for future messages
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Show error message in the UI
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Start a conversation by sending a message
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-auto' 
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-100 max-w-[80%] animate-pulse">
            Thinking...
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
} 