import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-green-delhi');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error}`);
        console.warn('Server continuing without database connection...');
        // process.exit(1); // Do not crash the server for DB connection issues
    }
};

export default connectDB;
