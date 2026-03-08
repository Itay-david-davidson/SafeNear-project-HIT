import express from 'express';
import shelterController from '../controllers/shelter.js'; 

const router = express.Router();

router.get('/', shelterController.getShelters);
router.get('/:id', shelterController.getShelterById);
router.post('/', shelterController.insertShelter);
router.put('/:id', shelterController.updateShelter);
router.delete('/:id', shelterController.deleteShelter);

export default router;