import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import { sendNotification,  getNotifications,storeNotificationToken } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/send-notification', sendNotification);
router.get('/', verifyToken, getNotifications);
router.post('/store-notification-token', verifyToken, storeNotificationToken);

export default router;
