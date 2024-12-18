import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const secretKey = process.env.SECRET_KEY;

export const verifyToken = (req, res, next) => {
    console.log("verify")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ msg: "Token is required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid token" });
        }

        req.userId = decoded.user;
        next();
    });
};
