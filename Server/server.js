import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db.js'; 
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import pondRoutes from './routes/pondRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import iotRoutes from './routes/iotRoutes.js';
import actionRoutes from './routes/actionRoutes.js';

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));



app.use('/api/auth', authRoutes);
app.use('/api/ponds', pondRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/Arduino',iotRoutes );
app.use('/api/actions', actionRoutes);




    app.get('/test', (req, res) => {
        const {id,password}=req.body;
        const arduinoQuery = 'SELECT * FROM Arduino WHERE id = ? AND iotPass = ?';

        db.query(arduinoQuery, [id, password], (err, arduinoResults) => {
            if (err) {
                console.error('Error validating Arduino:', err);
                return res.status(500).json({ msg: 'Failed to validate Arduino' });
            }
        
            if (arduinoResults.length === 0) {
                return res.status(401).json({ msg: 'Invalid ID or password' });
            }});
    });



app.get('/', (req, res) => {
    res.json({ msg:"Server Running"});
    console.log("Server Running");
});

app.listen(8080, '0.0.0.0', () => {
    console.log("Server Running on port 8080");
});
