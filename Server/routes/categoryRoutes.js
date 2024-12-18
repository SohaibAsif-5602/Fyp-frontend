import express from 'express';
import { getCategories, addCategory, editCategory, deleteCategory } from '../controllers/categroyController.js';
import { verifyToken } from '../Middlewares/middlewares.js';
const router = express.Router();

// Routes
router.get('/',verifyToken, getCategories); // Get all categories for a user
router.post('/',verifyToken, addCategory); // Add a new category
router.put('/:id',verifyToken, editCategory); // Edit a category
router.delete('/:id',verifyToken, deleteCategory); // Delete a category

export default router;