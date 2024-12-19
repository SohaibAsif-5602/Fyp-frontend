import db from '../db.js';
import axios from 'axios';

export const checkUserExists = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0);
        });
    });
};

export const saveVerificationCode = (email) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO EmailVerification (email, verification_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE verification_code = ?",
            [email, code, code],
            (err) => {
                if (err) return reject(err);
                resolve(code);
            }
        );
    });
};

export const verifyResetCodeInDb = (email, code) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM EmailVerification WHERE email = ? AND verification_code = ?",
            [email, code],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0);
            }
        );
    });
};

export const deleteVerificationCode = (email) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM EmailVerification WHERE email = ?", [email], (err) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

export const updatePassword = (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE Users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

// Check if a notification token already exists
export const checkNotificationToken = (userId, notificationToken) => {
    const query = 'SELECT * FROM not_token_table WHERE user_id = ? AND notification_token = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [userId, notificationToken], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Insert a new notification token into the database
export const insertNotificationToken = (userId, notificationToken) => {
    const query = 'INSERT INTO not_token_table (user_id, notification_token) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [userId, notificationToken], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};



export async function deleteRecords(channel_id, fish_id, pondId, res) {
  const dbQuery = (query, params, connection) =>
    new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

  try {
    const connection = await new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if (err) {
          return reject(err);
        }
        resolve(conn);
      });
    });

    // Begin transaction
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Delete the pond
    await dbQuery('DELETE FROM Pond WHERE pond_id = ?', [pondId], connection);

    // Delete alerts for the pond's channel
    await dbQuery('DELETE FROM Alert WHERE channel_id = ?', [channel_id], connection);

    // Delete the IoT channel data
    await dbQuery('DELETE FROM Iot WHERE channel_id = ?', [channel_id], connection);

    // Delete the fish data
    await dbQuery('DELETE FROM Fishgroup WHERE id = ?', [fish_id], connection);

    // Delete ThingSpeak channel
    const thingSpeakResponse = await axios.delete(
      `https://api.thingspeak.com/channels/${channel_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          api_key: process.env.THINGSPEAK_API_KEY,
        },
      }
    );

    if (thingSpeakResponse.status !== 200) {
      throw new Error('Failed to delete the ThingSpeak channel.');
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    connection.release(); // Release the connection back to the pool

    res.status(200).json({ msg: "Pond and related data deleted successfully, including ThingSpeak channel." });
  } catch (error) {
    // Rollback transaction in case of any error
    if (connection) {
      connection.rollback(() => {
        console.error('Transaction failed:', error);
        res.status(500).json({ msg: "Error deleting records.", error: error.message });
      });
    } else {
      res.status(500).json({ msg: "Error connecting to the database.", error: error.message });
    }
  }
}
