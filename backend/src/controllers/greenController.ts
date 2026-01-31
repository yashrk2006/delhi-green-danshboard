import { Request, Response } from 'express';
import GreenZone from '../models/GreenZone';

// Get all green zones
export const getAllZones = async (req: Request, res: Response) => {
    try {
        const zones = await GreenZone.find().sort({ greenCoverPercentage: -1 });
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get zone by ID
export const getZoneById = async (req: Request, res: Response) => {
    try {
        const zone = await GreenZone.findOne({ zoneId: req.params.id });
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }
        res.json(zone);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get zones by type
export const getZonesByType = async (req: Request, res: Response) => {
    try {
        const zones = await GreenZone.find({ type: req.params.type });
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create new zone
export const createZone = async (req: Request, res: Response) => {
    try {
        const zone = await GreenZone.create(req.body);
        res.status(201).json(zone);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

// Update zone
export const updateZone = async (req: Request, res: Response) => {
    try {
        const zone = await GreenZone.findOneAndUpdate(
            { zoneId: req.params.id },
            req.body,
            { new: true }
        );

        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        res.json(zone);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error });
    }
};

// Get green zone statistics
export const getGreenStats = async (req: Request, res: Response) => {
    try {
        const zones = await GreenZone.find();

        const totalZones = zones.length;
        const totalArea = zones.reduce((sum, z) => sum + z.areaSize, 0);
        const totalTrees = zones.reduce((sum, z) => sum + z.totalTrees, 0);
        const avgGreenCover = zones.reduce((sum, z) => sum + z.greenCoverPercentage, 0) / totalZones;

        res.json({
            totalZones,
            totalArea: totalArea.toFixed(2),
            totalTrees,
            avgGreenCover: avgGreenCover.toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
