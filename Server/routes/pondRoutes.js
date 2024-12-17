import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import { addPond, deletePond,getPonds,getPondData, editPond,getPondById } from '../controllers/pondController.js';

const router = express.Router();

router.post('/add-pond', verifyToken, addPond);
router.delete('/delete-pond/:pondId', verifyToken, deletePond);
router.get('/get-ponds', verifyToken, getPonds);
router.get('/getPondData/:pondId', verifyToken, getPondData);
router.put('/:pondId', verifyToken, editPond);

router.get('/pond/:pondId', verifyToken, getPondById);

export default router;