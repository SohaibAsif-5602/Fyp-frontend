import db from '../db.js';
import { sendPushNotification } from '../Services/notificationService.js';
import { checkNotificationToken, insertNotificationToken } from '../Services/dbService.js';


export const sendNotification = (req, res) => {
    sendPushNotification(18, 'ExponentPushToken[1EYGIYPdvYHFQOD1mFoPun]', 'Test1 Notification', 'This is a test notification');
    res.status(200).json({ msg: 'Notification sent successfully' });
};


export const getNotifications = (req, res) => {
    const userId = req.userId; 

    const query = 'SELECT notification_id, notification_title, notification_body, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ msg: 'Failed to fetch notifications' });
        }

        res.status(200).json(results);
    });
};


export const storeNotificationToken = async (req, res) => {
    const { notification_token: notificationToken } = req.body;
    const userId = req.userId;

    if (!notificationToken) {
        return res.status(400).json({ msg: 'Notification token is required' });
    }

    try {
        // Check if the token already exists
        const existingTokens = await checkNotificationToken(userId, notificationToken);
        if (existingTokens.length > 0) {
            return res.status(200).json({ msg: 'Notification token already exists' });
        }

        // Insert the new token into the database
        const result = await insertNotificationToken(userId, notificationToken);
        res.status(201).json({ msg: 'Notification token stored successfully', notification_id: result.insertId });
    } catch (error) {
        console.error('Error processing notification token:', error);
        res.status(500).json({ msg: 'An error occurred while storing the notification token' });
    }
};
