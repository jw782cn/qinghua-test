import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Todo, { ITodo } from '@/lib/models/todo';

// GET handler to retrieve all todos
export async function GET() {
  try {
    await connectToDatabase();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve todos' },
      { status: 500 }
    );
  }
}

// POST handler to create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    const { title, description } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const newTodo = await Todo.create({
      title,
      description,
      completed: false,
    });
    
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
} 