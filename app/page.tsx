import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureCard } from "./components/FeatureCard";
import Link from "next/link";
import { cardItems } from "./data/cardItems";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center">
        <div className="flex items-center gap-2">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C14 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" 
            fill="currentColor"/>
          </svg>
          <h1 className="text-xl font-bold text-black">manus</h1>
        </div>
        <div className="ml-auto">
          <div className="relative flex">
            <div className="rounded-full border-2 border-gray-200 h-8 w-8 flex items-center justify-center overflow-hidden">
              <span className="text-[10px] font-medium text-red-500">WangXS</span>
            </div>
            <div className="absolute -right-1 top-0 h-full w-1 bg-teal-400 rounded-r-sm"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Text */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-gray-800">Hello Chenran Night</h2>
          <p className="text-2xl text-gray-500 mt-2">What can I do for you?</p>
        </div>

        {/* Input Bar */}
        <div className="mb-16 relative">
          <Input 
            className="w-full py-6 px-4 rounded-2xl shadow-sm border-gray-200" 
            placeholder="Give Manus a task to work on..."
          />
          <div className="absolute right-4 bottom-3 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M18 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 21V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-8">
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg border-b-2 border-black px-4 py-2">Featured</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">Research</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">Life</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">Data Analysis</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">Education</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">Productivity</Button>
          <Button variant="ghost" className="text-sm font-medium rounded-t-lg px-4 py-2 text-gray-500">WTF</Button>
        </div>

        {/* Demo Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* MongoDB Todo Demo */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-2">MongoDB Todo Demo</h3>
            <p className="text-blue-700 mb-4">Check out our Todo app connected to MongoDB</p>
            <Link href="/todos">
              <Button className="bg-blue-600 hover:bg-blue-700">Open Todo App</Button>
            </Link>
          </div>
          
          {/* Chat Demo Link */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-green-800 mb-2">AI Chat Demo</h3>
            <p className="text-green-700 mb-4">Try our AI chat powered by OpenRouter</p>
            <Link href="/chat">
              <Button className="bg-green-600 hover:bg-green-700">Open Chat</Button>
            </Link>
          </div>
          
          {/* History Demo Link */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-800 mb-2">Chat History</h3>
            <p className="text-purple-700 mb-4">Browse your past conversations</p>
            <Link href="/history">
              <Button className="bg-purple-600 hover:bg-purple-700">View History</Button>
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardItems.map((item) => (
            <FeatureCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
