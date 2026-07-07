const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();
const app = express();

// ─── SCRIPT DE MIGRATION (compatible toutes versions MySQL/MariaDB) ───

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

async function addColumnIfMissing(table, column, definition) {
  const exists = await columnExists(table, column);
  if (exists) {
    console.log(`ℹ️ Colonne '${column}' déjà présente sur '${table}'.`);
    return;
  }
  await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  console.log(`✅ Colonne '${column}' ajoutée sur '${table}'.`);
}

const runMigration = async () => {
  console.log("🚀 Vérification des migrations sur Aiven...");
  try {
    await addColumnIfMissing('annonces', 'slug', 'VARCHAR(255) UNIQUE AFTER titre');
    await addColumnIfMissing('annonce_images', 'public_id', 'VARCHAR(255) AFTER url');
    console.log("✅ Migrations vérifiées avec succès.");
  } catch (err) {
    console.error("❌ Erreur SQL migration :", err.message);
  }
};

runMigration();
// ──────────────────────────────────────

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080', 
    'https://tunisie-immobilier-pro.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/annonces', require('./routes/annonces'));
app.use('/api/upload',   require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});