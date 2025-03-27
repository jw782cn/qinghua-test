import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Conversation from '@/lib/models/conversation';

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get pagination parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Find all conversations with pagination, sort by newest first
    const conversations = await Conversation.find({})
      .select({
        _id: 1,
        'messages.0.content': 1, // Get first message content as preview
        'messages.0.role': 1,    // Get first message role
        createdAt: 1,
        updatedAt: 1,
        messagesCount: { $size: '$messages' } // Count messages in each conversation
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Count total conversations for pagination
    const total = await Conversation.countDocuments({});
    
    // Return the conversations list with pagination info
    return NextResponse.json({
      conversations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: unknown) {
    console.error('Error listing conversations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to list conversations';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 