import mongoose from 'mongoose';

const airQualitySchema = new mongoose.Schema({
    stationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String, required: true },
        zone: { type: String, required: true }
    },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
    lastReading: {
        aqi: { type: Number, required: true },
        pm25: { type: Number, required: true },
        pm10: { type: Number, required: true },
        no2: { type: Number, required: true },
        category: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    history: [{
        aqi: Number,
        pm25: Number,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('AirQuality', airQualitySchema);
