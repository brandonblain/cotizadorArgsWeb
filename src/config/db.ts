import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Atlas Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar con MongoDB Atlas:', error);
    process.exit(1);
  }
};