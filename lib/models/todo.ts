import mongoose, { Schema, Document } from 'mongoose';

// Define the Todo interface
export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Todo schema
const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create or retrieve the Todo model
const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', todoSchema);

export default Todo; 