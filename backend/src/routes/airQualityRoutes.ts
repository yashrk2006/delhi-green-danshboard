import express from 'express';
import {
    getAllSensors,
    getSensorById,
    getSensorsByZone,
    createSensor,
    updateSensorReading,
    getAQIStats,
    getLiveAQI
} from '../controllers/airQualityController';

const router = express.Router();

router.get('/', getAllSensors);
router.get('/live', getLiveAQI); // Register LIVE route
router.get('/stats', getAQIStats);
router.get('/:id', getSensorById);
router.get('/zone/:zone', getSensorsByZone);
router.post('/', createSensor);
router.put('/:id', updateSensorReading);

export default router;
