'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Trash2, Edit, RefreshCw } from 'lucide-react';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const data = await response.json();
      setTodos(data.todos);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle form submission to create a new todo
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setError(null);
      
      // Refresh todo list
      fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodoStatus = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      // Refresh todo list
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      // Refresh todo list
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create Todo</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Todo title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Textarea
              placeholder="Todo description (optional)"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </Button>
        </form>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Todo List</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTodos} 
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent mx-auto"></div>
          </div>
        )}
        
        {todos.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No todos yet. Add your first one above!
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li 
                key={todo._id} 
                className={`border rounded-lg p-4 ${
                  todo.completed ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={todo.completed ? 'line-through text-gray-500' : ''}>
                    <h3 className="font-medium">{todo.title}</h3>
                    {todo.description && <p className="text-sm mt-1">{todo.description}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => toggleTodoStatus(todo._id, todo.completed)}
                    >
                      <Check className={`h-4 w-4 ${todo.completed ? 'text-green-500' : ''}`} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => deleteTodo(todo._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 