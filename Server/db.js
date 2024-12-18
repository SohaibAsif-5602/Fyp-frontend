import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const db1 = mysql.createPool({ // Create a connection pool for better performance
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });



export default db1;
