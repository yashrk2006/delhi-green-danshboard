import mongoose from 'mongoose';

const waterSensorSchema = new mongoose.Schema({
    sensorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        riverPoint: { type: String, required: true }
    },
    lastReading: {
        ph: { type: Number, required: true },
        dissolvedOxygen: { type: Number, required: true },
        bod: { type: Number, required: true },
        healthScore: { type: Number, required: true },
        status: { type: String, enum: ['excellent', 'good', 'moderate', 'poor', 'critical'], default: 'moderate' },
        timestamp: { type: Date, default: Date.now }
    }
}, { timestamps: true });

export default mongoose.model('WaterSensor', waterSensorSchema);
