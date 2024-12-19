import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import { sendNotification,  getNotifications,storeNotificationToken,getNotificationsByPond } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/send-notification', sendNotification);
router.get('/', verifyToken, getNotifications);
router.post('/store-notification-token', verifyToken, storeNotificationToken);
router.get('/get-notifications-by-pond/:pondId', verifyToken, getNotificationsByPond);
export default router;
