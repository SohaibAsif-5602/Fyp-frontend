import express from 'express';
import sql from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import axios from 'axios'

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = crypto.randomBytes(64).toString('hex');
const saltrounds = 10;

const db = sql.createConnection({
    host: 'localhost',
    database: 'FYPDATABASE',
    password: 'Sohaib210886sql',
    user: 'root'
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
});



app.post('/signup',(req,res)=>{
    const {email,password,username}=req.body;
    
    db.query("Select * from Users where email=?",[email],(err,result)=>{
        if(err) return res.status(500).json({msg:"Server Error 1"});
        if(result.length>0) return res.status(400).json({msg:"user already exists"})

    bcrypt.hash(password,saltrounds,(err,hash)=>{

        if(err) return res.status(500).json({msg:"Server Error 2"});

        db.query("Insert into Users(email,password,username) values(?,?,?)",[email,hash,username],(err,result)=>{
            if(err) return res.status(500).json({msg:"Error inserting in database"});
            res.status(201).json({msg:"User Registered Successfully"});
        })
    })
    });
 });
 app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json("SQL Server error");
        if (result.length === 0) return res.status(400).json("User not found");

        const user = result[0];

        

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json("Error comparing password");
            if (!isMatch) return res.status(400).json("Passwords do not match");

            const token = jwt.sign({ user: user.user_id }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ msg: "Login Successful", token });
        });
    });
});

app.get('/getPonds', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ msg: "Token is required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid token" });
        }

        console.log('Decoded token:', decoded);
        const userId = decoded.user;
        console.log('User ID:', userId);

        const query = `
            SELECT
                p.pond_id ,
                p.pond_name, 
                p.pond_loc, 
                f.specie, 
                f.imagelink, 
                p.pond_score 
            FROM Pond p
            JOIN Fishgroup f ON p.fish_id = f.id
            WHERE p.user_id = ?`;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ msg: "Database query error" });
            }

            return res.status(200).json({ ponds: results });
        });
    });
});

app.get('/getPondData/:pondId', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const pondId = req.params.pondId;

    if (!token) {
        return res.status(403).json({ msg: 'Token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'Invalid token' });
        }

        const userId = decoded.user;
        
        // Verify that the pond belongs to the user and fetch the channel ID and read key
        const query = `
            SELECT p.channel_id, p.pond_score, i.channel_read 
            FROM Pond p 
            JOIN Iot i ON p.channel_id = i.channel_id 
            WHERE p.pond_id = ? AND p.user_id = ?`;
        console.log('Pond ID:', pondId);
        console.log('User ID:', userId);
        db.query(query, [pondId, userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ msg: 'Database query error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Pond not found or access denied' });
            }

            const { channel_id, pond_score, channel_read } = results[0];

            // Fetch data from ThingSpeak using the channel ID and API read key
            const url = `https://api.thingspeak.com/channels/${channel_id}/feeds.json?api_key=${channel_read}&results=100`;

            axios.get(url)
                .then(response => {
                    const feeds = response.data.feeds;
                    const formattedDates = feeds.map(feed => feed.created_at.split('T')[0]);

                    const temperatureData = feeds.map(feed => ({
                        date: feed.created_at.split('T')[0],
                        value: parseFloat(feed.field1)
                    }));

                    const phData = feeds.map(feed => ({
                        date: feed.created_at.split('T')[0],
                        value: parseFloat(feed.field2)
                    }));

                    const turbidityData = feeds.map(feed => ({
                        date: feed.created_at.split('T')[0],
                        value: parseFloat(feed.field3)
                    }));

                    // Send response containing pond health score and ThingSpeak data
                    res.status(200).json({
                        pond_score: pond_score,
                        temperatureData: temperatureData,
                        phData: phData,
                        turbidityData: turbidityData,
                        dates: [...new Set(formattedDates)]
                    });
                })
                .catch(error => {
                    console.error('Error fetching data from ThingSpeak:', error);
                    res.status(500).json({ msg: 'Error fetching data from ThingSpeak' });
                });
        });
    });
});

app.post('/add-pond', async (req, res) => {
    const { channelName, location, fishSpecies, fishAge } = req.body;

    // Extract token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ msg: 'Token is required' });
    }

    // Verify the token to extract userId
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'Invalid token' });
        }

        const userId = decoded.user;

        if (!channelName || !location || !fishSpecies || !fishAge || !userId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let channelId, fishId;

        // Step 1: Create a channel on ThingSpeak
        axios.post('https://api.thingspeak.com/channels.json', {
            api_key: 'Q8PT7VOXW47SYUWJ',
            name: channelName,
            public_flag: true,
            field1: 'Temperature',
            field2: 'pH',
            field3: 'Dissolved_oxygen',
        })
            .then(channelResponse => {
                channelId = channelResponse.data.id;

                let writeApiKey = '';
                let readApiKey = '';

                // Extract the API keys
                channelResponse.data.api_keys.forEach((key) => {
                    if (key.write_flag) {
                        writeApiKey = key.api_key;
                    } else {
                        readApiKey = key.api_key;
                    }
                });

                // Insert ThingSpeak data into the Iot table
                db.query(
                    'INSERT INTO Iot (channel_id, channel_read, channel_write) VALUES (?, ?, ?)',
                    [channelId, readApiKey, writeApiKey],
                    (error) => {
                        if (error) {
                            console.error('Error inserting ThingSpeak data into the database:', error);
                            return res.status(500).json({ error: 'Failed to insert ThingSpeak data into the database' });
                        }

                        // Proceed to insert fish data
                        insertFishData();
                    }
                );
            })
            .catch(error => {
                console.error('Error creating ThingSpeak channel:', error);
                return res.status(500).json({ error: 'Failed to create channel on ThingSpeak' });
            });

        // Function to insert fish data
        function insertFishData() {
            db.query(
                'INSERT INTO Fishgroup (age, specie, imagelink) VALUES (?, ?, ?)',
                [fishAge, fishSpecies, 'default_image_link'], // Replace with actual image link if available
                (error, fishResult) => {
                    if (error) {
                        console.error('Error inserting fish data into the database:', error);
                        return res.status(500).json({ error: 'Failed to insert fish data into the database' });
                    }

                    fishId = fishResult.insertId;
                    insertPondData();
                }
            );
        }

        function insertPondData() {
            db.query(
                'INSERT INTO Pond (channel_id, pond_name, pond_loc, fish_id, user_id, pond_score) VALUES (?, ?, ?, ?, ?, ?)',
                [channelId, channelName, location, fishId, userId, 0], // Assuming pond_score is initialized to 0
                (error) => {
                    if (error) {
                        console.error('Error inserting pond data into the database:', error);
                        return res.status(500).json({ error: 'Failed to insert pond data into the database' });
                    }

                    // Send the success response
                    res.status(200).json({ message: 'Pond and channel created successfully' });
                }
            );
        }
    });
});

app.post('/sendEmail', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    db.query("Select * from Users where email=?",[email],(err,result)=>{
        if(err) return res.status(500).json({msg:"Server Error 1"});
        if(result.length>0) return res.status(400).json({msg:"user already exists"})
        });

    db.query("SELECT verification_code FROM EmailVerification WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Database query error" });

        let code;

        if (result.length > 0) {
            code = result[0].verification_code;
        } else {
            code = Math.floor(100000 + Math.random() * 900000);

            db.query("INSERT INTO EmailVerification(email, verification_code) VALUES(?, ?)", [email, code], (err, insertResult) => {
                if (err) return res.status(500).json({ message: "Error inserting into database" });
            });
        }
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '210886@students.au.edu.pk', // Your email address
                    pass: 'sohaib210886'   // Your email password
                }
            });

            let mailOptions = {
                from: '210886@students.au.edu.pk',
                to: email,
                subject: 'Machiro Two-Factor Authentication Code',
                html: `
                <div style="background-color: #5e5e5e; color: white; padding: 20px; text-align: center;">
                    <h1>Machiro Two-Factor Authentication Code</h1>
                    <p>Dear User,</p>
                    <p>Your two-factor authentication code is: <strong>${code}</strong></p>
                    <p>Please enter this code to verify your account.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p>Best regards,<br>The Machiro Team</p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ message: error.message });
                } else {
                    return res.status(200).json({ message: 'Verification email sent to your account' });
                }
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
});

app.post('/verifyCode', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
    }

    // Check if email and code match in the database
    db.query("SELECT * FROM EmailVerification WHERE email = ? AND verification_code = ?", [email, code], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (result.length > 0) {
            // If the email and code match, proceed to delete the entry
            db.query("DELETE FROM EmailVerification WHERE email = ?", [email], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    return res.status(500).json({ message: 'Error deleting verification record' });
                }

                // Email verified and record deleted successfully
                return res.status(200).json({ message: 'Email verified successfully!' });
            });
        } else {
            // If no match is found, verification fails
            return res.status(400).json({ message: 'Invalid email or verification code' });
        }
    });
});

app.post('/sendResetCode', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the user exists
    db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Database query error" });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        // Generate a reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000);

        // Store the reset code in the database
        db.query("INSERT INTO PasswordReset(email, reset_code) VALUES(?, ?) ON DUPLICATE KEY UPDATE reset_code = VALUES(reset_code)", [email, resetCode], (err, insertResult) => {
            if (err) return res.status(500).json({ message: "Error inserting into database" });

            // Send email with reset code
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '210886@students.au.edu.pk',
                    pass: 'sohaib210886'
                }
            });

            let mailOptions = {
                from: '210886@students.au.edu.pk',
                to: email,
                subject: 'Machiro Password Reset Code',
                html: `
                <div style="background-color: #5e5e5e; color: white; padding: 20px; text-align: center;">
                    <h1>Machiro Password Reset Code</h1>
                    <p>Your password reset code is: <strong>${resetCode}</strong></p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p>Best regards,<br>The Machiro Team</p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ message: error.message });
                } else {
                    return res.status(200).json({ message: 'Password reset code sent to your email' });
                }
            });
        });
    });
});

// Verify reset code
app.post('/verifyResetCode', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
    }

    db.query("SELECT * FROM PasswordReset WHERE email = ? AND reset_code = ?", [email, code], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (result.length > 0) {
            return res.status(200).json({ message: 'Reset code verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid email or reset code' });
        }
    });
});

// Reset password
app.post('/resetPassword', (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    db.query("SELECT * FROM PasswordReset WHERE email = ? AND reset_code = ?", [email, code], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid email or reset code' });
        }

        // Hash the new password
        bcrypt.hash(newPassword, saltrounds, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            // Update the password in the database
            db.query("UPDATE Users SET password = ? WHERE email = ?", [hash, email], (updateErr, updateResult) => {
                if (updateErr) return res.status(500).json({ message: "Error updating password" });

                // Delete the reset code from the database
                db.query("DELETE FROM PasswordReset WHERE email = ?", [email], (deleteErr, deleteResult) => {
                    if (deleteErr) console.error("Error deleting reset code:", deleteErr);

                    return res.status(200).json({ message: 'Password reset successfully' });
                });
            });
        });
    });
});


app.post('/create-channel', async (req, res) => {

    const { channelName, location, fishSpecies, fishAge, userId } = req.body;
  
    if (!channelName || !location || !fishSpecies || !fishAge || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    let channelId, fishId;
  
    try {
      // Step 1: Create a channel on ThingSpeak
      try {
        const channelResponse = await axios.post('https://api.thingspeak.com/channels.json', {
          api_key: 'Q8PT7VOXW47SYUWJ',
          name: channelName,
          public_flag: true,
          field1: 'Temperature',
          field2: 'pH',
          field3: 'Dissolved_oxygen',
        });
        channelId = channelResponse.data.id;
  
        let writeApiKey = '';
        let readApiKey = '';
  
        // Extract the API keys
        channelResponse.data.api_keys.forEach((key) => {
          if (key.write_flag) {
            writeApiKey = key.api_key;
          } else {
            readApiKey = key.api_key;
          }
        });
  
        // Insert ThingSpeak data into the Iot table
        db.query(
          'INSERT INTO Iot (channel_id, channel_read, channel_write) VALUES (?, ?, ?)',
          [channelId, readApiKey, writeApiKey],
          (error) => {
            if (error) {
              console.error('Error inserting ThingSpeak data into the database:', error);
              return res.status(500).json({ error: 'Failed to insert ThingSpeak data into the database' });
            }
  
            // Proceed to insert fish data
            insertFishData();
          }
        );
  
      } catch (error) {
        console.error('Error creating ThingSpeak channel:', error);
        return res.status(500).json({ error: 'Failed to create channel on ThingSpeak' });
      }
  
      // Function to insert fish data
      function insertFishData() {
        db.query(
          'INSERT INTO Fishgroup (age, specie, imagelink) VALUES (?, ?, ?)',
          [fishAge, fishSpecies, 'default_image_link'], // Replace with actual image link if available
          (error, fishResult) => {
            if (error) {
              console.error('Error inserting fish data into the database:', error);
              return res.status(500).json({ error: 'Failed to insert fish data into the database' });
            }
  
            fishId = fishResult.insertId;
            insertPondData();
          }
        );
      }
  
      function insertPondData() {
        db.query(
          'INSERT INTO Pond (channel_id, pond_name, pond_loc, fish_id, user_id, pond_score) VALUES (?, ?, ?, ?, ?, ?)',
          [channelId, channelName, location, fishId, userId, 0], // Assuming pond_score is initialized to 0
          (error) => {
            if (error) {
              console.error('Error inserting pond data into the database:', error);
              return res.status(500).json({ error: 'Failed to insert pond data into the database' });
            }
  
            // Send the success response
            res.status(200).json({ message: 'Pond and channel created successfully' });
          }
        );
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });


app.listen(8080, '0.0.0.0', () => {
    console.log("Server Running on 8080");
});



function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ msg: "Token is required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid token" });
        }

        req.userId = decoded.user; // Attach userId to the request object
        next(); // Proceed to the next middleware or route handler
    });
}

// Helper function to delete records in /delete-pond API
function deleteRecords(channel_id, fish_id, pondId, res) {
    // Begin transaction to ensure atomic deletion
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).json({ msg: "Transaction error." });
        }

        // Delete the pond first
        const deletePondQuery = 'DELETE FROM Pond WHERE pond_id = ?';
        db.query(deletePondQuery, [pondId], (pondErr) => {
            if (pondErr) {
                return db.rollback(() => {
                    res.status(500).json({ msg: "Error deleting pond." });
                });
            }

            // Delete alerts for the pond's channel
            const deleteAlertsQuery = 'DELETE FROM Alert WHERE channel_id = ?';
            db.query(deleteAlertsQuery, [channel_id], (alertErr) => {
                if (alertErr) {
                    return db.rollback(() => {
                        res.status(500).json({ msg: "Error deleting alerts." });
                    });
                }

                // Delete the IoT channel data
                const deleteIotQuery = 'DELETE FROM Iot WHERE channel_id = ?';
                db.query(deleteIotQuery, [channel_id], (iotErr) => {
                    if (iotErr) {
                        return db.rollback(() => {
                            res.status(500).json({ msg: "Error deleting IoT channel." });
                        });
                    }

                    // Delete the fish data
                    const deleteFishQuery = 'DELETE FROM Fishgroup WHERE id = ?';
                    db.query(deleteFishQuery, [fish_id], (fishErr) => {
                        if (fishErr) {
                            return db.rollback(() => {
                                res.status(500).json({ msg: "Error deleting fish data." });
                            });
                        }

                        // Commit the transaction
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    res.status(500).json({ msg: "Transaction commit error." });
                                });
                            }
                            res.status(200).json({ msg: "Pond and related data deleted successfully." });
                        });
                    });
                });
            });
        });
    });
}

// DELETE Pond API
app.delete('/delete-pond/:pondId', verifyToken, (req, res) => {
    const userId = req.userId;
    const pondId = req.params.pondId;

    // Check if the pond belongs to the user
    const verifyQuery = 'SELECT pond_id, channel_id, fish_id FROM Pond WHERE pond_id = ? AND user_id = ?';
    db.query(verifyQuery, [pondId, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: "Database query error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: "Pond not found or does not belong to the user." });
        }

        const { channel_id, fish_id } = results[0];

        // Call the deleteRecords function
        deleteRecords(channel_id, fish_id, pondId, res);
    });
});







