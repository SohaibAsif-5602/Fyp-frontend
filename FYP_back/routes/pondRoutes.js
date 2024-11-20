import express from 'express';
import { verifyToken } from '../middlewares.js';
import { addPond, deletePond } from '../controllers/pondController.js';

const router = express.Router();

router.post('/add-pond', verifyToken, addPond);
router.delete('/delete-pond/:pondId', verifyToken, deletePond);

export default router;
