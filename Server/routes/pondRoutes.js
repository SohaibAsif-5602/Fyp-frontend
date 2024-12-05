import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import { addPond, deletePond,getPonds,getPondData } from '../controllers/pondController.js';

const router = express.Router();

router.post('/add-pond', verifyToken, addPond);
router.delete('/delete-pond/:pondId', verifyToken, deletePond);
router.get('/get-ponds', verifyToken, getPonds);
router.get('/getPondData/:pondId', verifyToken, getPondData);


export default router;
