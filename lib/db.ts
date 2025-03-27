import mongoose from 'mongoose';

// Local type declaration for global MongoDB connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// Initialize global connection
global.mongoose = global.mongoose || { conn: null, promise: null };

const MONGODB_URI = process.env.MONGO_PUBLIC_URL || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase() {
  if (global.mongoose.conn) {
    // Use existing connection if available
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Create new connection
    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose.connection;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  // Wait for connection to be established
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase; 