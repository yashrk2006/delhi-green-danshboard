import express from 'express';
import {
    getAllSensors,
    getSensorById,
    getCriticalSensors,
    createSensor,
    updateSensorReading,
    getWaterStats
} from '../controllers/waterController';

const router = express.Router();

router.get('/', getAllSensors);
router.get('/stats', getWaterStats);
router.get('/critical', getCriticalSensors);
router.get('/:id', getSensorById);
router.post('/', createSensor);
router.put('/:id', updateSensorReading);

export default router;
