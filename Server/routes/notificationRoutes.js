import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import { sendNotification, storeNotification, getNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/send-notification', sendNotification);
router.post('/', verifyToken, storeNotification);
router.get('/', verifyToken, getNotifications);

export default router;
