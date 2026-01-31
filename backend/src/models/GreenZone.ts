import mongoose from 'mongoose';

const greenZoneSchema = new mongoose.Schema({
    zoneId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String, required: true }
    },
    type: { type: String, required: true }, // Park, Forest, Urban Garden
    areaSize: { type: Number, required: true }, // in sq km
    greenCoverPercentage: { type: Number, required: true },
    totalTrees: { type: Number, required: true },
    lastAudit: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('GreenZone', greenZoneSchema);
