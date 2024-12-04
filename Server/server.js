import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db.js'; 
import authRoutes from './routes/authRoutes.js';
import pondRoutes from './routes/pondRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/ponds', pondRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(8080, '0.0.0.0', () => {
    console.log("Server Running on port 8080");
});
