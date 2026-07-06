const mysql = require('mysql2/promise');
require('dotenv').config();

// On détecte si on est sur localhost ou sur un serveur distant (Aiven)
const isLocalhost = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // CORRECTION : On applique le SSL uniquement si on n'est PAS sur localhost
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;