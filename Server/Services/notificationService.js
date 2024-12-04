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
        await axios.post('http://localhost:8080/api/notifications', {
            userId: userId,
            notification_title: title,
            notification_body: body,
        });
    } catch (error) {
        console.error('Error storing notification:', error);
    }
};
