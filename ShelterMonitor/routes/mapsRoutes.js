import { Router } from 'express';
import { getMaps,getMapById,insertMap,updateMap,deleteMap } from '../controllers/maps.js';
const router = Router();

router.get('/api/maps', getMaps);
router.get('/api/maps/:id', getMapById);
router.post('/api/maps', insertMap);
router.put('/api/maps/:id', updateMap);
router.delete('/api/maps/:id', deleteMap);

export default router;