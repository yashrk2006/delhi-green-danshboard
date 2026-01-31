import { Request, Response } from 'express';
import WasteBin from '../models/WasteBin';

// Get all waste bins
export const getAllBins = async (req: Request, res: Response) => {
    try {
        const bins = await WasteBin.find().sort({ fillLevel: -1 });
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get bin by ID
export const getBinById = async (req: Request, res: Response) => {
    try {
        const bin = await WasteBin.findOne({ binId: req.params.id });
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.json(bin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get bins by zone
export const getBinsByZone = async (req: Request, res: Response) => {
    try {
        const bins = await WasteBin.find({ 'location.zone': req.params.zone });
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get bins that need pickup (> 75% full)
export const getBinsNeedingPickup = async (req: Request, res: Response) => {
    try {
        const bins = await WasteBin.find({ fillLevel: { $gte: 75 } }).sort({ fillLevel: -1 });
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create new bin
export const createBin = async (req: Request, res: Response) => {
    try {
        const bin = await WasteBin.create(req.body);
        res.status(201).json(bin);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

// Update bin status
export const updateBin = async (req: Request, res: Response) => {
    try {
        const bin = await WasteBin.findOneAndUpdate(
            { binId: req.params.id },
            req.body,
            { new: true }
        );

        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.json(bin);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error });
    }
};

// Get waste statistics
export const getWasteStats = async (req: Request, res: Response) => {
    try {
        const bins = await WasteBin.find();

        const totalBins = bins.length;
        const fullBins = bins.filter(b => b.fillLevel >= 75).length;
        const avgFillLevel = Math.round(bins.reduce((sum, b) => sum + b.fillLevel, 0) / totalBins);

        res.json({
            totalBins,
            fullBins,
            avgFillLevel,
            activeBins: bins.filter(b => b.status === 'active').length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
