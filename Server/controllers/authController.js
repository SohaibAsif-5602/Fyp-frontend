import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { secretKey } from '../Middlewares/middlewares.js';
import {
    checkUserExists,
    saveVerificationCode,
    verifyResetCodeInDb,
    updatePassword,
    deleteVerificationCode,
} from '../Services/dbService.js';
import { sendVerificationEmail, sendResetEmail } from '../Services/emailService.js';



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



const saltRounds = 10;

export const sendEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const userExists = await checkUserExists(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const code = await saveVerificationCode(email);
        await sendVerificationEmail(email, code);

        return res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    try {
        const isValid = await verifyResetCodeInDb(email, code);
        if (!isValid) return res.status(400).json({ message: 'Invalid email or code' });

        await deleteVerificationCode(email);
        return res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const sendResetCode = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const userExists = await checkUserExists(email);
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        const code = await saveVerificationCode(email);
        await sendResetEmail(email, code);

        return res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    try {
        const isValid = await verifyResetCodeInDb(email, code);
        if (isValid) return res.status(200).json({ message: 'Reset code verified successfully' });

        return res.status(400).json({ message: 'Invalid email or reset code' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    try {
        const isValid = await verifyResetCodeInDb(email, code);
        if (!isValid) return res.status(400).json({ message: 'Invalid email or reset code' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await updatePassword(email, hashedPassword);
        await deleteVerificationCode(email);

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
