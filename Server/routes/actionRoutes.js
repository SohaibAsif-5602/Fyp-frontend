import express from 'express';
import { updateAction,  getActionById } from '../controllers/actionController.js';
import { verifyToken } from '../Middlewares/middlewares.js';

const router = express.Router();

// router.post('/add', verifyToken,addAction); // Add a new action
router.put('/update/:action_id',verifyToken, updateAction); // Update an existing action
// router.get('/getAll',verifyToken, getActions); // Get all actions
router.get('/get/:action_id',verifyToken, getActionById); // Get a specific action by ID

export default router;
