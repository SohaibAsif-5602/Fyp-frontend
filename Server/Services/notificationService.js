import axios from 'axios';

export const sendPushNotification = async (userId, token, title, body) => {
    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
    };

    await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    });

    try {

           const  notification_title= title;
           const notification_body= body;
        


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
    } catch (error) {
        console.error('Error storing notification:', error);
    }
};


