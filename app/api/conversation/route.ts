import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Conversation from '@/lib/models/conversation';

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get conversation ID from query parameter
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('id');
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Return the conversation messages
    return NextResponse.json({
      messages: conversation.messages,
      conversationId: conversation._id,
    });
    
  } catch (error: unknown) {
    console.error('Error fetching conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversation';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 