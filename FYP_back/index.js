import express from 'express';
import sql from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = crypto.randomBytes(64).toString('hex');
const saltrounds = 10;

const db = sql.createConnection({
    host: 'localhost',
    database: 'taha',
    password: '2003',
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

            const token = jwt.sign({ user: user.id }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ msg: "Login Successful", token });
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
