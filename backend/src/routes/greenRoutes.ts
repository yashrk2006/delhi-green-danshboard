import express from 'express';
import {
    getAllZones,
    getZoneById,
    getZonesByType,
    createZone,
    updateZone,
    getGreenStats
} from '../controllers/greenController';

const router = express.Router();

router.get('/', getAllZones);
router.get('/stats', getGreenStats);
router.get('/:id', getZoneById);
router.get('/type/:type', getZonesByType);
router.post('/', createZone);
router.put('/:id', updateZone);

export default router;
