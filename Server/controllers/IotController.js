import db from "../dbpool.js";
import { sendPushNotification } from "../Services/notificationService.js";




export const submit_user_info = (req, res) => {
    console.log("submit_user_info");
  
    const wifiId = req.query.var1;
    const password = req.query.var2;
    const ip = req.query.var3;
  
    if (!wifiId || !password || !ip) {
      return res.status(400).json({
        success: false,
        message: 'Missing wifi_id, password, or ip in the request.'
      });
    }
  
    console.log('Received User Info:');
    console.log(`WiFi ID: ${wifiId}`);
    console.log(`Password: ${password}`);
    console.log(`IP: ${ip}`);
  
    const query = `INSERT INTO Arduino (iotId, iotPass, iotIp) VALUES (?, ?, ?)`;
    db.query(query, [wifiId, password, ip], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to save data to the database.',
          error: err.message
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User info received and saved successfully.',
        data: {
          wifiId,
          password,
          ip
        }
      });
    });
}



export const sendAlert = async (req, res) => {


  const iid = req.query.var1;
    const password = req.query.var2;
    const sensorValue = req.query.var3;
    const sensorType = req.query.var4;
    const alertLevel = req.query.var5;
    console.log("sendAlert");
    console.log(req.body);

    
    // Validate the request body
    if (!iid || !password || !sensorValue || !sensorType || !alertLevel) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        // Step 1: Validate ID and password
        const arduinoQuery = 'SELECT id FROM Arduino WHERE iotId = ? AND iotPass = ?';
const arduinoResults = await db.query(arduinoQuery, [iid, password]);

if (arduinoResults.length === 0) {
    console.log("Invalid ID or password");
    return res.status(401).json({ msg: 'Invalid ID or password' });
}


// Extract just the id from the first object in the array
const id = arduinoResults[0][0].id; // or arduinoResults[0].id if there's only one item
console.log("Arduino ID:", id);

        // Step 2: Find the associated pond ID
        const pondQuery = 'SELECT pond_id, user_id FROM Pond WHERE arduino_id = ?';
        const pondResults = await db.query(pondQuery, [id]);
        if (pondResults.length === 0) {
            return res.status(404).json({ msg: 'No pond associated with this Arduino' });
        }

        const { pond_id, user_id } = pondResults[0][0];
        console.log(pond_id);
        console.log(user_id);
        // Step 3: Retrieve the user's notification token
        const tokenQuery = 'SELECT notification_token FROM not_token_table WHERE user_id = ?';
        const tokenResults = await db.query(tokenQuery, [user_id]);
        if (tokenResults.length === 0) {
            return res.status(404).json({ msg: 'No notification token found for this user' });
        }

        const { notification_token } = tokenResults[0][0];
        console.log(notification_token);
        // Step 4: Call the sendPushNotification function
        const title = `Sensor Alert: ${sensorType}`;
        const body = `Sensor Value: ${sensorValue}, Alert Level: ${alertLevel}`;
        console.log("Sending notification");
        await sendPushNotification(user_id, notification_token, title, body, pond_id);

        res.status(200).json({ msg: 'Notification sent and stored successfully' });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ msg: 'An unexpected error occurred' });
    }
};






