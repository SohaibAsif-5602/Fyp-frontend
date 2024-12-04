import db from '../db.js';
import { sendPushNotification } from '../notificationService.js';

export const sendNotification = (req, res) => {
    sendPushNotification(18, 'ExponentPushToken[1EYGIYPdvYHFQOD1mFoPun]', 'Test1 Notification', 'This is a test notification');
    res.status(200).json({ msg: 'Notification sent successfully' });
};

export const storeNotification = (req, res) => {
    const { userId, notification_title, notification_body } = req.body;

    if (!userId || !notification_title || !notification_body) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const query = 'INSERT INTO notifications (user_id, notification_title, notification_body) VALUES (?, ?, ?)';
    db.query(query, [userId, notification_title, notification_body], (err, result) => {
        if (err) {
            console.error('Error inserting notification:', err);
            return res.status(500).json({ msg: 'Failed to store notification' });
        }

        res.status(201).json({ msg: 'Notification stored successfully', notification_id: result.insertId });
    });
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
