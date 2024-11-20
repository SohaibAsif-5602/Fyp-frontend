import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database");
});

export default db;
