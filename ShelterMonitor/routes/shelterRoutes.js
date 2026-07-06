import { Router } from 'express';
import { getShelters, getShelterById, insertShelter, updateShelter, deleteShelter } from '../controllers/shelter.js';

const router = Router();

router.get('/', getShelters);
router.get('/:id', getShelterById);
router.post('/', insertShelter);
router.put('/:id', updateShelter);
router.delete('/:id', deleteShelter);

export default router;
