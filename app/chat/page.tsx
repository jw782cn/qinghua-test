import ChatInterface from "../components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manus AI Chat</h1>
        <p className="text-gray-500">Ask anything and get responses powered by OpenRouter</p>
      </header>
      
      <div className="max-w-3xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  );
} 