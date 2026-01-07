import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGODB_URI as string;

    await mongoose.connect(mongoURI);
    
    console.log('MongoDB Connected Successfully');
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Error:', err);
});

export default connectDB;