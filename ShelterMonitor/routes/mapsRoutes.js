import { Router } from 'express';
import { getMaps,getMapById,insertMap,updateMap,deleteMap } from '../controllers/maps.js';
const router = Router();

router.get('/', getMaps);
router.get('/:id', getMapById);
router.post('/', insertMap);
router.put('/:id', updateMap);
router.delete('/:id', deleteMap);

export default router;