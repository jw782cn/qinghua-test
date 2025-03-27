import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { connectToDatabase } from '@/lib/db';
import Conversation from '@/lib/models/conversation';

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Parse the request body
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Generate response using OpenRouter
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.7-sonnet',
      messages: messages,
    });
    
    const assistantResponse = completion.choices[0].message;
    
    // Save the conversation to the database
    let conversation;
    
    // If there's an existing conversation ID, find and update it
    const conversationId = req.headers.get('x-conversation-id');
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    
    // If no conversation found or no ID provided, create a new one
    if (!conversation) {
      conversation = new Conversation({
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
        })),
      });
    }
    
    // Add the assistant's response to the conversation
    conversation.messages.push({
      role: 'assistant',
      content: assistantResponse.content || '',
      timestamp: new Date(),
    });
    
    // Save the conversation
    await conversation.save();
    
    // Return the response along with the conversation ID
    return NextResponse.json({
      message: assistantResponse,
      conversationId: conversation._id,
    });
    
  } catch (error: unknown) {
    console.error('Error generating response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
