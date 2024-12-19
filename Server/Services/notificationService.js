import axios from 'axios';
import db from '../db.js';
export const sendPushNotification = async (userId, token, title, body, pondId) => {
    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
    };

    // Send the push notification
    await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    });

    try {
        const notification_title = title;
        const notification_body = body;

        // Validate input
        if (!userId || !notification_title || !notification_body) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // SQL query to insert notification with pond_id
        const query = `
            INSERT INTO notifications (user_id, notification_title, notification_body, pond_id)
            VALUES (?, ?, ?, ?)
        `;

        db.query(query, [userId, notification_title, notification_body, pondId || null], (err, result) => {
            if (err) {
                console.error('Error inserting notification:', err);
                return res.status(500).json({ msg: 'Failed to store notification' });
            }

            
        });
    } catch (error) {
        console.error('Error storing notification:', error);
    }
};


