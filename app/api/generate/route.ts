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

    // Get conversation ID from headers if it exists
    const conversationId = req.headers.get('x-conversation-id');
    
    // Find existing conversation if ID is provided
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      
      // If conversation found, add the latest user message to it
      if (conversation) {
        // Get the last user message from the incoming messages array
        const latestUserMessage = messages[messages.length - 1];
        if (latestUserMessage && latestUserMessage.role === 'user') {
          conversation.messages.push({
            role: latestUserMessage.role,
            content: latestUserMessage.content,
            timestamp: new Date(),
          });
        }
      }
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
      // Save immediately to get an ID
      await conversation.save();
    }

    // Get the ID for the response
    const responseConversationId = conversation._id.toString();
    
    // Create a text encoder for the stream
    const encoder = new TextEncoder();
    
    // Create a variable to collect the full response
    let fullAssistantResponse = '';
    
    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate response using OpenRouter with streaming
          const completion = await openai.chat.completions.create({
            model: 'anthropic/claude-3.7-sonnet',
            messages: messages,
            stream: true,
          });
          
          // Process the stream chunks
          for await (const chunk of completion) {
            // Extract the content delta
            const content = chunk.choices[0]?.delta?.content || '';
            
            // Accumulate the full response
            fullAssistantResponse += content;
            
            // Send the chunk to the client with the conversation ID
            const dataChunk = {
              content,
              conversationId: responseConversationId,
            };
            
            // Encode and send the chunk
            controller.enqueue(encoder.encode(JSON.stringify(dataChunk) + '\n'));
          }
          
          // After stream is complete, save the full response to the database
          if (fullAssistantResponse) {
            conversation.messages.push({
              role: 'assistant',
              content: fullAssistantResponse,
              timestamp: new Date(),
            });
            
            await conversation.save();
          }
          
          // Stream is complete
          controller.close();
        } catch (error) {
          // Handle any errors that occur during streaming
          console.error('Error in stream processing:', error);
          controller.error(error);
        }
      },
    });
    
    // Return the stream response
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
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
