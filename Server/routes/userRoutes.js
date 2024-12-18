import express from 'express';
import multer from 'multer';
import { verifyToken } from '../Middlewares/middlewares.js';
import { getUser, updateUser } from '../controllers/userController.js';

const router = express.Router();


router.get('/', verifyToken, getUser);
router.post('/', verifyToken, updateUser);
export default router;
