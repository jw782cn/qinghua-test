"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchConversations } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { 
  MessageCircle, 
  Brain, 
  Code, 
  Book, 
  Image, 
  Music, 
  Video, 
  FileText, 
  Search,
  HelpCircle
} from "lucide-react";

interface Conversation {
  _id: string;
  messages: {
    role: string;
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const useChineseFormat = true;

  // Load conversations on page load and when pagination changes
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchConversations(pagination.page, pagination.limit);
        setConversations(data.conversations);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [pagination.page, pagination.limit]);

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return useChineseFormat
        ? format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
        : format(date, 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  // Extract a preview of the conversation
  const getPreview = (conversation: Conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const firstMessage = conversation.messages[0];
      // Truncate the message if it's too long
      const content = firstMessage.content || '';
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    }
    return 'No messages';
  };

  // Get the appropriate icon based on conversation content
  const getIconComponent = (conversation: Conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const firstMessage = conversation.messages[0].content?.toLowerCase() || '';
      
      if (firstMessage.includes('code') || firstMessage.includes('program') || firstMessage.includes('javascript') || firstMessage.includes('typescript')) {
        return { icon: <Code size={18} />, bg: 'bg-blue-100', color: 'text-blue-600' };
      } else if (firstMessage.includes('image') || firstMessage.includes('picture') || firstMessage.includes('photo')) {
        return { icon: <Image size={18} aria-hidden="true" />, bg: 'bg-green-100', color: 'text-green-600' };
      } else if (firstMessage.includes('music') || firstMessage.includes('audio') || firstMessage.includes('song')) {
        return { icon: <Music size={18} />, bg: 'bg-purple-100', color: 'text-purple-600' };
      } else if (firstMessage.includes('video') || firstMessage.includes('movie') || firstMessage.includes('film')) {
        return { icon: <Video size={18} />, bg: 'bg-red-100', color: 'text-red-600' };
      } else if (firstMessage.includes('book') || firstMessage.includes('read') || firstMessage.includes('article')) {
        return { icon: <Book size={18} />, bg: 'bg-amber-100', color: 'text-amber-600' };
      } else if (firstMessage.includes('search') || firstMessage.includes('find') || firstMessage.includes('look for')) {
        return { icon: <Search size={18} />, bg: 'bg-indigo-100', color: 'text-indigo-600' };
      } else if (firstMessage.includes('document') || firstMessage.includes('file') || firstMessage.includes('text')) {
        return { icon: <FileText size={18} />, bg: 'bg-gray-100', color: 'text-gray-600' };
      } else if (firstMessage.includes('ai') || firstMessage.includes('intelligence') || firstMessage.includes('neural')) {
        return { icon: <Brain size={18} />, bg: 'bg-cyan-100', color: 'text-cyan-600' };
      } else if (firstMessage.includes('help') || firstMessage.includes('assist') || firstMessage.includes('support')) {
        return { icon: <HelpCircle size={18} />, bg: 'bg-emerald-100', color: 'text-emerald-600' };
      }
    }
    // Default icon
    return { icon: <MessageCircle size={18} />, bg: 'bg-gray-100', color: 'text-gray-600' };
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Conversation History</h1>
            <p className="text-gray-500">View and continue your previous conversations</p>
          </div>
          <Link href="/chat">
            <Button>New Chat</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8">Loading conversations...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don&apos;t have any conversations yet.</p>
            <Link href="/chat">
              <Button>Start a new conversation</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Link 
                  key={conversation._id} 
                  href={`/chat?id=${conversation._id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md ${getIconComponent(conversation).bg} ${getIconComponent(conversation).color}`}>
                        {getIconComponent(conversation).icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(conversation.updatedAt)}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {conversation.messagesCount} messages
                          </span>
                        </div>
                        <p className="text-gray-700">{getPreview(conversation)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-8">
                <Button 
                  onClick={handlePrevPage} 
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button 
                  onClick={handleNextPage} 
                  disabled={pagination.page === pagination.pages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 