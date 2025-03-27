"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateStreamResponse, fetchConversation } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, PlusCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import MessageList from "./MessageList";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // State for streaming response
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Load conversation history on page load
  useEffect(() => {
    const loadConversation = async () => {
      // Check URL for conversation ID
      const urlConversationId = searchParams.get("id");

      // Check localStorage for conversation ID if not in URL
      const storedConversationId = localStorage.getItem("conversationId");

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
            localStorage.setItem("conversationId", conversation.conversationId);
          }
        } catch (error) {
          console.error("Failed to load conversation:", error);
          // If the conversation is not found, clear localStorage
          if (storedConversationId) {
            localStorage.removeItem("conversationId");
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
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Set loading state
    setIsLoading(true);

    try {
      // Reset streaming content
      setStreamingContent("");

      // Prepare all messages for API
      const allMessages = [...messages, userMessage];

      // Stream response handler
      const handleStreamChunk = (chunk: {
        content: string;
        conversationId: string;
      }) => {
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
          { role: "assistant", content: streamingContent },
        ]);

        // Clear streaming content once it's added to messages
        setStreamingContent("");
      }

      // Save the conversation ID for future messages
      if (result.conversationId) {
        setConversationId(result.conversationId);
        // Save to localStorage for persistence across refreshes
        localStorage.setItem("conversationId", result.conversationId);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      // Show error message in the UI
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
      // Clear any partial streaming content
      setStreamingContent("");
    } finally {
      setIsLoading(false);
      // Focus input after sending
      inputRef.current?.focus();
    }
  };

  // Start a new conversation
  const handleNewChat = () => {
    // Clear messages and conversation ID
    setMessages([]);
    setConversationId(undefined);
    setStreamingContent("");

    // Clear localStorage
    localStorage.removeItem("conversationId");

    // Redirect to chat page without ID parameter
    router.push("/chat");

    // Focus input after creating new chat
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden shadow-lg border-none">
      {conversationId && (
        <CardHeader className="py-3 px-4 border-b bg-slate-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-slate-700">Conversation</h3>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={handleNewChat}
            >
              <PlusCircle size={14} />
              New Chat
            </Button>
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1 p-0 overflow-y-auto">
        <MessageList
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
          isInitialLoading={isInitialLoading}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
        />
      </CardContent>

      <CardFooter className="p-3 border-t bg-slate-50">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-slate-300 focus-visible:ring-blue-500 px-4 py-2 shadow-sm"
            disabled={isLoading || isInitialLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || isInitialLoading || !input.trim()}
            className="rounded-full px-4 shadow-sm bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
