import { Request, Response } from 'express';
import axios from 'axios';
import AirQuality from '../models/AirQuality';

// Fetch live data from AQICN (World Air Quality Index)
export const getLiveAQI = async (req: Request, res: Response) => {
    try {
        const token = process.env.WAQI_TOKEN;

        // If no token or explicit 'demo' mode, return high-quality mock data (Fallback)
        if (!token || token === 'demo') {
            console.log('Using simulated live data (No API Token)');
            return res.json({
                source: 'simulated',
                data: generateMockLiveSensors()
            });
        }

        // Fetch real data from AQICN for Delhi NCR Bounds
        // Fetch real data from AQICN for Delhi NCR Bounds (Widened to include outlying NCR areas)
        // Bounds: South-West (28.1, 76.5) to North-East (29.1, 77.8)
        const url = `https://api.waqi.info/map/bounds/?latlng=28.1,76.5,29.1,77.8&token=${token}`;
        const response = await axios.get(url);

        console.log(`AQICN API Status: ${response.data.status}, Data Length: ${response.data.data?.length}`);

        if (response.data.status !== 'ok') {
            throw new Error('Upstream API Error');
        }

        const formattedData = response.data.data
            .filter((station: any) =>
                station.lat &&
                station.lon &&
                !isNaN(parseFloat(station.lat)) &&
                !isNaN(parseFloat(station.lon))
            )
            .map((station: any) => {
                let aqi = parseInt(station.aqi, 10);
                if (isNaN(aqi)) aqi = -1; // Fallback for invalid AQI

                return {
                    id: station.uid,
                    location: station.station.name.split(',')[0],
                    city: 'Delhi NCR',
                    aqi: aqi,
                    lat: parseFloat(station.lat),
                    lng: parseFloat(station.lon),
                    pm25: aqi === -1 ? 0 : Math.floor(aqi * 0.7),
                    pm10: aqi === -1 ? 0 : Math.floor(aqi * 0.85),
                    category: getAQICategory(aqi),
                    lastUpdated: new Date()
                };
            });

        res.json({
            source: 'live',
            data: formattedData
        });

    } catch (error) {
        console.error('AQI Fetch Error:', error);
        // Fallback to simulated data on error
        res.json({
            source: 'fallback',
            data: generateMockLiveSensors()
        });
    }
};

// Helper: Generate Mock Data for Fallback
const generateMockLiveSensors = () => {
    // We can reuse the robust list we made for the frontend
    // For brevity, generating a simplified set here which the frontend can augment
    const baseLocations = [
        { name: 'Punjabi Bagh', lat: 28.6683, lon: 77.1330 },
        { name: 'Mandir Marg', lat: 28.6364, lon: 77.1987 },
        { name: 'RK Puram', lat: 28.5672, lon: 77.1863 },
        { name: 'Anand Vihar', lat: 28.6508, lon: 77.3152 },
        { name: 'Dwarka Sector 8', lat: 28.5700, lon: 77.0700 },
        { name: 'IGI Airport', lat: 28.5600, lon: 77.1000 },
        { name: 'Pusa', lat: 28.6389, lon: 77.1617 },
        { name: 'Jawaharlal Nehru Stadium', lat: 28.5866, lon: 77.2411 },
        { name: 'Sonia Vihar', lat: 28.7188, lon: 77.2655 },
        { name: 'Narela', lat: 28.8550, lon: 77.0910 },
        { name: 'Bawana', lat: 28.7760, lon: 77.0426 },
        { name: 'Okhla Phase 2', lat: 28.5350, lon: 77.2750 },
        { name: 'Major Dhyan Chand National Stadium', lat: 28.6120, lon: 77.2360 },
        { name: 'Lodhi Road', lat: 28.5910, lon: 77.2270 },
        { name: 'Sri Aurobindo Marg', lat: 28.5450, lon: 77.1950 },
        { name: 'Vivek Vihar', lat: 28.6650, lon: 77.3150 },
        { name: 'Najafgarh', lat: 28.6090, lon: 76.9850 },
        { name: 'Wazirpur', lat: 28.6980, lon: 77.1650 },
        { name: 'Alipur', lat: 28.8150, lon: 77.1530 },
        { name: 'Ashok Vihar', lat: 28.6950, lon: 77.1810 },
        { name: 'Jahangirpuri', lat: 28.7330, lon: 77.1690 },
        { name: 'Patparganj', lat: 28.6230, lon: 77.2950 },
        { name: 'Rohini', lat: 28.7320, lon: 77.1180 },
        { name: 'Mundka', lat: 28.6790, lon: 77.0260 }
    ];

    return baseLocations.map((loc, idx) => {
        const aqi = Math.floor(Math.random() * 300) + 50;
        return {
            id: 1000 + idx,
            location: loc.name,
            city: 'Delhi',
            aqi: aqi,
            pm25: Math.floor(aqi * 0.6),
            pm10: Math.floor(aqi * 0.8),
            category: getAQICategory(aqi),
            lat: loc.lat,
            lng: loc.lon
        };
    });
};

const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Poor';
    return 'Severe';
};

// Get all air quality sensors
export const getAllSensors = async (req: Request, res: Response) => {
    try {
        const sensors = await AirQuality.find().sort({ 'lastReading.aqi': -1 });
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get sensor by ID
export const getSensorById = async (req: Request, res: Response) => {
    try {
        const sensor = await AirQuality.findOne({ stationId: req.params.id });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        res.json(sensor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get sensors by zone
export const getSensorsByZone = async (req: Request, res: Response) => {
    try {
        const sensors = await AirQuality.find({ 'location.zone': req.params.zone });
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create new sensor reading
export const createSensor = async (req: Request, res: Response) => {
    try {
        const sensor = await AirQuality.create(req.body);
        res.status(201).json(sensor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

// Update sensor reading
export const updateSensorReading = async (req: Request, res: Response) => {
    try {
        const sensor = await AirQuality.findOne({ stationId: req.params.id });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Update last reading
        sensor.lastReading = { ...sensor.lastReading, ...req.body };

        // Add to history
        sensor.history.push({
            aqi: req.body.aqi,
            pm25: req.body.pm25,
            timestamp: new Date()
        });

        await sensor.save();
        res.json(sensor);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error });
    }
};

// Get AQI statistics
export const getAQIStats = async (req: Request, res: Response) => {
    try {
        const sensors = await AirQuality.find({ status: 'active' });

        const totalAQI = sensors.reduce((sum, s) => sum + (s.lastReading?.aqi || 0), 0);
        const avgAQI = Math.round(totalAQI / sensors.length);

        const totalPM25 = sensors.reduce((sum, s) => sum + (s.lastReading?.pm25 || 0), 0);
        const avgPM25 = Math.round(totalPM25 / sensors.length);

        res.json({
            totalSensors: sensors.length,
            avgAQI,
            avgPM25,
            activeSensors: sensors.filter(s => s.status === 'active').length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
