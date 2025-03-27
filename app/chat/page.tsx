"use client";

import { Suspense } from "react";
import ChatInterface from "../components/ChatInterface";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manus AI Chat</h1>
            <p className="text-gray-500">Ask anything and get responses powered by OpenRouter</p>
          </div>
          <Link href="/history">
            <Button variant="outline">View History</Button>
          </Link>
        </div>
      </header>
      
      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<div className="p-4 text-center">Loading chat...</div>}>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  );
} 