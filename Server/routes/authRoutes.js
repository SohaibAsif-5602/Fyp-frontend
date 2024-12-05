import express from 'express';
import { signup, login,sendEmail, verifyCode, sendResetCode, verifyResetCode, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendEmail', sendEmail);
router.post('/verifyCode', verifyCode);
router.post('/sendResetCode', sendResetCode);
router.post('/verifyResetCode', verifyResetCode);
router.post('/resetPassword', resetPassword);

export default router;
