import { TodoApp } from '../components/Todo';

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Todo App with MongoDB</h1>
        <p className="text-center text-gray-500 text-sm mt-1">Connected to MongoDB database</p>
      </header>
      
      <main className="py-8">
        <TodoApp />
      </main>
    </div>
  );
} 