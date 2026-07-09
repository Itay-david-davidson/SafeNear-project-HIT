
import { Router } from 'express';
import { getUsers, getUserById, insertUser, updateUser, deleteUser } from '../controllers/users.js';
const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', insertUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;