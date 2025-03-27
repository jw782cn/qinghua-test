import mongoose, { Schema, Document } from 'mongoose';

// Define the Message interface
export interface IMessage extends Document {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the Conversation interface
export interface IConversation extends Document {
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Message schema
const messageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define the Conversation schema
const conversationSchema = new Schema<IConversation>(
  {
    messages: [messageSchema],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create or retrieve the Conversation model
const Conversation = mongoose.models.Conversation || 
  mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation; 