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


app.listen(8080, '0.0.0.0', () => {
    console.log("Server Running on 8080");
});









// app.post('/protected',(req,res)=>{
//     const token=req.headers['authorization']?.split('')[1];
//     if(!token) return res.status(401).json("No token provided");

//     jwt.verify(token,secretKey,(err,decoded)=>{
//         if(err) return res.status(300).json("Invalid token");
//         res.status(200).json({msg:'You are autorized',userId:decoded.userId})
//     })
// })
