import login from '../controllers/auth.js';

const express = require('express');
const router = express.Router();

router.post('/login', login);
    
export default router;