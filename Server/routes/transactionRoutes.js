import {addTransaction,
    updateTransaction,
    getTransactions,
getCategories} from '../controllers/transactionControllers.js';
import express from 'express';
const router = express.Router();
import { verifyToken } from '../Middlewares/middlewares.js';

// POST: Add a new transaction
router.post('/', verifyToken, addTransaction);

// PUT: Update an existing transaction
router.put('/:transaction_id', verifyToken, updateTransaction);

// GET: Fetch all transactions for the logged-in user
router.get('/', verifyToken, getTransactions);

router.get('/categories', verifyToken, getCategories);

export default router;