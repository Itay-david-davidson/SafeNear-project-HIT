import { Router } from 'express';
import { getShelters, getShelterById, insertShelter, updateShelter, deleteShelter } from '../controllers/shelter.js';

const router = Router();

router.get('/api/shelters', getShelters);
router.get('/api/shelters/:id', getShelterById);
router.post('/api/shelters', insertShelter);
router.put('/api/shelters/:id', updateShelter);
router.delete('/api/shelters/:id', deleteShelter);

export default router;
