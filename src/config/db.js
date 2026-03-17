import mongoose from 'mongoose';

const dbConnection = async () => {

  try {
    await mongoose.connect(process.env.MONGO_URI);
      console.log('Conected to MongoDB Atlas');
    
  } catch (error) {
      console.error('Connection error:', error.message);
      process.exit(1);
  }
};

export default dbConnection;