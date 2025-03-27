"use client";

import React from 'react';
import { Send, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
  streamingContent: string;
  isLoading: boolean;
  isInitialLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({
  messages,
  streamingContent,
  isLoading,
  isInitialLoading,
  messagesEndRef
}: MessageListProps) {
  return (
    <div className="flex flex-col p-4 space-y-6">
      {isInitialLoading ? (
        <div className="space-y-4 py-10">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px] ml-auto" />
              <Skeleton className="h-4 w-[200px] ml-auto" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ) : messages.length === 0 && !streamingContent ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Send size={24} className="text-slate-400" />
          </div>
          <p className="text-center font-medium">Start a conversation by sending a message</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div 
              key={index}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-white text-sm",
                  message.role === 'user' 
                    ? "bg-blue-500" 
                    : "bg-slate-700"
                )}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </Avatar>
                <div 
                  className={cn(
                    "p-4 rounded-2xl whitespace-pre-wrap",
                    message.role === 'user' 
                      ? "bg-blue-50 text-slate-800" 
                      : "bg-slate-100 text-slate-800"
                  )}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {/* Show streaming content as it comes in */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
                  AI
                </Avatar>
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 whitespace-pre-wrap">
                  {streamingContent}
                </div>
              </div>
            </div>
          )}
          
          {/* Loading indicator only shown when there's no streaming content yet */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
                  AI
                </Avatar>
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-slate-500" />
                  <span className="text-slate-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
} 