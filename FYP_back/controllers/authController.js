import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { secretKey } from '../middlewares.js';

const saltrounds = 10;

export const signup = (req, res) => {
    const { email, password, username } = req.body;

    db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ msg: "Server Error" });
        if (result.length > 0) return res.status(400).json({ msg: "User already exists" });

        bcrypt.hash(password, saltrounds, (err, hash) => {
            if (err) return res.status(500).json({ msg: "Server Error" });

            db.query("INSERT INTO Users (email, password, username) VALUES (?, ?, ?)", [email, hash, username], (err) => {
                if (err) return res.status(500).json({ msg: "Error inserting in database" });
                res.status(201).json({ msg: "User Registered Successfully" });
            });
        });
    });
};

export const login = (req, res) => {
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
};
