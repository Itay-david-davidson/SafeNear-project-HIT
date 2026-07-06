
import { Router } from 'express';
const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', insertUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;