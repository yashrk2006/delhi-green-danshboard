import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import airQualityRoutes from './routes/airQualityRoutes';
import wasteRoutes from './routes/wasteRoutes';
import waterRoutes from './routes/waterRoutes';
import greenRoutes from './routes/greenRoutes';
import { startDataSync } from './services/dataSyncService';

dotenv.config();

connectDB();
startDataSync(); // Start automated government data sync

const app = express();

app.use(cors());
app.use(express.json());

// Root route - API Information
app.get('/', (req, res) => {
    res.json({
        message: 'Smart Green Delhi API',
        version: '1.0.0',
        status: 'Active',
        endpoints: {
            airQuality: '/api/air-quality',
            waste: '/api/waste',
            water: '/api/water',
            green: '/api/green'
        },
        documentation: 'See README.md for full API documentation'
    });
});

// Routes
app.use('/api/air-quality', airQualityRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/green', greenRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
