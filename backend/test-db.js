require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await conn.query('SELECT * FROM admins');
    console.log('✅ Connexion OK - Admins:', rows);
    conn.end();
  } catch (err) {
    console.error('❌ Erreur DB:', err.message);
  }
}
test();