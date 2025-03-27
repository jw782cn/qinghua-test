"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateStreamResponse, fetchConversation } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // State for streaming response
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Load conversation history on page load
  useEffect(() => {
    const loadConversation = async () => {
      // Check URL for conversation ID
      const urlConversationId = searchParams.get('id');
      
      // Check localStorage for conversation ID if not in URL
      const storedConversationId = localStorage.getItem('conversationId');
      
      // Use URL param first, then localStorage
      const convId = urlConversationId || storedConversationId || undefined;
      
      if (convId) {
        try {
          setIsInitialLoading(true);
          const conversation = await fetchConversation(convId);
          
          if (conversation && conversation.messages) {
            setMessages(conversation.messages);
            setConversationId(conversation.conversationId);
            
            // Save conversation ID to localStorage
            localStorage.setItem('conversationId', conversation.conversationId);
          }
        } catch (error) {
          console.error('Failed to load conversation:', error);
          // If the conversation is not found, clear localStorage
          if (storedConversationId) {
            localStorage.removeItem('conversationId');
          }
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        setIsInitialLoading(false);
      }
    };

    loadConversation();
  }, [searchParams]);

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
      // Reset streaming content
      setStreamingContent('');
      
      // Prepare all messages for API
      const allMessages = [...messages, userMessage];
      
      // Stream response handler
      const handleStreamChunk = (chunk: { content: string; conversationId: string }) => {
        if (chunk.content) {
          setStreamingContent((prev) => prev + chunk.content);
        }
      };
      
      // Call the streaming API
      const result = await generateStreamResponse(
        allMessages, 
        handleStreamChunk, 
        conversationId
      );
      
      // After stream completes, add the full assistant response to the messages
      if (streamingContent) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: streamingContent }
        ]);
        
        // Clear streaming content once it's added to messages
        setStreamingContent('');
      }
      
      // Save the conversation ID for future messages
      if (result.conversationId) {
        setConversationId(result.conversationId);
        // Save to localStorage for persistence across refreshes
        localStorage.setItem('conversationId', result.conversationId);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Show error message in the UI
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
      ]);
      // Clear any partial streaming content
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const handleNewChat = () => {
    // Clear messages and conversation ID
    setMessages([]);
    setConversationId(undefined);
    setStreamingContent('');
    
    // Clear localStorage
    localStorage.removeItem('conversationId');
    
    // Redirect to chat page without ID parameter
    router.push('/chat');
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
      {conversationId && (
        <div className="p-2 border-b flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={handleNewChat}
          >
            Start New Chat
          </Button>
        </div>
      )}
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {isInitialLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading conversation...
          </div>
        ) : messages.length === 0 && !streamingContent ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Start a conversation by sending a message
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
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
            ))}
            
            {/* Show streaming content as it comes in */}
            {streamingContent && (
              <div className="p-3 rounded-lg bg-gray-100 max-w-[80%]">
                {streamingContent}
              </div>
            )}
            
            {/* Loading indicator only shown when there's no streaming content yet */}
            {isLoading && !streamingContent && (
              <div className="p-3 rounded-lg bg-gray-100 max-w-[80%] animate-pulse">
                Thinking...
              </div>
            )}
            
            {/* Invisible div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading || isInitialLoading}
        />
        <Button type="submit" disabled={isLoading || isInitialLoading || !input.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
} 