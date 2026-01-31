import express from 'express';
import {
    getAllBins,
    getBinById,
    getBinsByZone,
    getBinsNeedingPickup,
    createBin,
    updateBin,
    getWasteStats
} from '../controllers/wasteController';

const router = express.Router();

router.get('/', getAllBins);
router.get('/stats', getWasteStats);
router.get('/pickup', getBinsNeedingPickup);
router.get('/:id', getBinById);
router.get('/zone/:zone', getBinsByZone);
router.post('/', createBin);
router.put('/:id', updateBin);

export default router;
