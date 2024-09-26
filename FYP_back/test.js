// // Set up Mailbit transporter
// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.mailbit.com',  // Mailbit's SMTP server
//     port: 587,                       // TLS port
//     secure: false,                   // Use TLS
//     auth: {
//         user: '210886@students.au.edu.pk',  // Your Mailbit SMTP username
//         pass: 'sohaib210886'   // Your Mailbit SMTP password
//     }
// });

// Signup route with email verification
// app.post('/signup', (req, res) => {
//     const { email, password, username } = req.body;

//     db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
//         if (err) return res.status(500).json({ msg: "Server Error 1" });
//         if (result.length > 0) return res.status(400).json({ msg: "User already exists" });

//         bcrypt.hash(password, saltrounds, (err, hash) => {
//             if (err) return res.status(500).json({ msg: "Server Error 2" });

//             // Insert user into the Users table
//             db.query("INSERT INTO Users (email, password, username) VALUES (?, ?, ?)", [email, hash, username], (err, result) => {
//                 if (err) return res.status(500).json({ msg: "Error inserting into database" });

//                 const userId = result.insertId;
//                 const verificationToken = crypto.randomBytes(32).toString('hex');

//                 // Insert token into email_verification table
//                 db.query("INSERT INTO email_verification (user_id, token) VALUES (?, ?)", [userId, verificationToken], (err) => {
//                     if (err) return res.status(500).json({ msg: "Error inserting token" });

//                     // Send verification email
//                     const verificationUrl = `http://localhost:8080/verify/${verificationToken}`;
//                     const mailOptions = {
//                         from: '210886@students.au.edu.pk', // Sender address
//                         to: email,                     // Receiver's email
//                         subject: 'Email Verification',
//                         html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`
//                     };

//                     transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                             console.log(error)
//                             return res.status(500).json({ msg: "Error sending email",error });
//                         }
//                         res.status(201).json({ msg: "User registered. Please check your email for verification." });
//                     });
//                 });
//             });
//         });
//     });
// });

// // Email verification route
// app.get('/verify/:token', (req, res) => {
//     const { token } = req.params;

//     // Check if token exists in the email_verification table
//     db.query("SELECT * FROM email_verification WHERE token = ?", [token], (err, result) => {
//         if (err) return res.status(500).json({ msg: "Server Error" });
//         if (result.length === 0) return res.status(400).json({ msg: "Invalid or expired token" });

//         const verificationRecord = result[0];

//         // Update the user's verification status
//         db.query("UPDATE Users SET is_verified = TRUE WHERE user_id = ?", [verificationRecord.user_id], (err) => {
//             if (err) return res.status(500).json({ msg: "Error verifying user" });

//             // Remove the token from email_verification table
//             db.query("DELETE FROM email_verification WHERE token = ?", [token], (err) => {
//                 if (err) return res.status(500).json({ msg: "Error deleting token" });

//                 res.status(200).json({ msg: "Email verified successfully" });
//             });
//         });
//     });
// });



app.post('/iot', (req, res) => {
    const { channel_read, channel_write } = req.body;
    const query = 'INSERT INTO Iot (channel_read, channel_write) VALUES (?, ?)';
    
    db.query(query, [channel_read, channel_write], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Iot channel created', channelId: result.insertId });
    });
});


app.get('/iot', (req, res) => {
    db.query('SELECT * FROM Iot', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

app.put('/iot/:id', (req, res) => {
    const { id } = req.params;
    const { channel_read, channel_write } = req.body;
    const query = 'UPDATE Iot SET channel_read = ?, channel_write = ? WHERE channel_id = ?';
    
    db.query(query, [channel_read, channel_write, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Iot channel updated' });
    });
});


app.delete('/iot/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Iot WHERE channel_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Iot channel deleted' });
    });
});


app.post('/fishgroup', (req, res) => {
    const { age, specie } = req.body;
    const query = 'INSERT INTO Fishgroup (age, specie) VALUES (?, ?)';
    
    db.query(query, [age, specie], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Fishgroup created', fishId: result.insertId });
    });
});


app.get('/fishgroup', (req, res) => {
    db.query('SELECT * FROM Fishgroup', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

app.put('/fishgroup/:id', (req, res) => {
    const { id } = req.params;
    const { age, specie } = req.body;
    const query = 'UPDATE Fishgroup SET age = ?, specie = ? WHERE id = ?';
    
    db.query(query, [age, specie, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Fishgroup updated' });
    });
});

app.delete('/fishgroup/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Fishgroup WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Fishgroup deleted' });
    });
});

app.post('/alert', (req, res) => {
    const { channel_id, alert_type, measurement, alert_time } = req.body;
    const query = 'INSERT INTO Alert (channel_id, alert_type, measurement, alert_time) VALUES (?, ?, ?, ?)';
    
    db.query(query, [channel_id, alert_type, measurement, alert_time], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Alert created', alertId: result.insertId });
    });
});

app.get('/alert', (req, res) => {
    db.query('SELECT * FROM Alert', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

app.put('/alert/:id', (req, res) => {
    const { id } = req.params;
    const { channel_id, alert_type, measurement, alert_time } = req.body;
    const query = 'UPDATE Alert SET channel_id = ?, alert_type = ?, measurement = ?, alert_time = ? WHERE alert_id = ?';
    
    db.query(query, [channel_id, alert_type, measurement, alert_time, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Alert updated' });
    });
});


app.delete('/alert/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Alert WHERE alert_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Alert deleted' });
    });
});


app.post('/pond', (req, res) => {
    const { channel_id, pond_name, pond_loc, fish_id, pond_score, user_id } = req.body;
    const query = 'INSERT INTO Pond (channel_id, pond_name, pond_loc, fish_id, pond_score, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [channel_id, pond_name, pond_loc, fish_id, pond_score, user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Pond created', pondId: result.insertId });
    });
});


app.get('/pond', (req, res) => {
    db.query('SELECT * FROM Pond', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});


app.put('/pond/:id', (req, res) => {
    const { id } = req.params;
    const { channel_id, pond_name, pond_loc, fish_id, pond_score, user_id } = req.body;
    const query = 'UPDATE Pond SET channel_id = ?, pond_name = ?, pond_loc = ?, fish_id = ?, pond_score = ?, user_id = ? WHERE pond_id = ?';
    
    db.query(query, [channel_id, pond_name, pond_loc, fish_id, pond_score, user_id, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Pond updated' });
    });
});


app.delete('/pond/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Pond WHERE pond_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Pond deleted' });
    });
});




