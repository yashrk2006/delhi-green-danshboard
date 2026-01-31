import { Request, Response } from 'express';
import WaterSensor from '../models/WaterSensor';

// Get all water sensors
export const getAllSensors = async (req: Request, res: Response) => {
    try {
        const sensors = await WaterSensor.find().sort({ 'lastReading.healthScore': -1 });
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get sensor by ID
export const getSensorById = async (req: Request, res: Response) => {
    try {
        const sensor = await WaterSensor.findOne({ sensorId: req.params.id });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        res.json(sensor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get critical sensors (health score < 40)
export const getCriticalSensors = async (req: Request, res: Response) => {
    try {
        const sensors = await WaterSensor.find({ 'lastReading.healthScore': { $lt: 40 } });
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create new sensor
export const createSensor = async (req: Request, res: Response) => {
    try {
        const sensor = await WaterSensor.create(req.body);
        res.status(201).json(sensor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

// Update sensor reading
export const updateSensorReading = async (req: Request, res: Response) => {
    try {
        const sensor = await WaterSensor.findOneAndUpdate(
            { sensorId: req.params.id },
            { lastReading: { ...req.body, timestamp: new Date() } },
            { new: true }
        );

        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        res.json(sensor);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error });
    }
};

// Get water quality statistics
export const getWaterStats = async (req: Request, res: Response) => {
    try {
        const sensors = await WaterSensor.find();

        const totalSensors = sensors.length;
        const avgHealthScore = Math.round(
            sensors.reduce((sum, s) => sum + (s.lastReading?.healthScore || 0), 0) / totalSensors
        );
        const criticalZones = sensors.filter(s => (s.lastReading?.healthScore || 100) < 40).length;

        res.json({
            totalSensors,
            avgHealthScore,
            criticalZones,
            activeSensors: totalSensors
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
