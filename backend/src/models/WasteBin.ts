import mongoose from 'mongoose';

const wasteBinSchema = new mongoose.Schema({
    binId: { type: String, required: true, unique: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String, required: true },
        zone: { type: String, required: true }
    },
    fillLevel: { type: Number, required: true },
    status: { type: String, enum: ['active', 'full', 'maintenance'], default: 'active' },
    lastPickup: { type: Date },
    type: { type: String, default: 'General Waste' }
}, { timestamps: true });

export default mongoose.model('WasteBin', wasteBinSchema);
