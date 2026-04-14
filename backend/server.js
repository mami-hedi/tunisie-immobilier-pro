const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); // 1. Assure-toi d'importer ta config DB ici
require('dotenv').config();

const app = express();

// ─── SCRIPT DE MIGRATION TEMPORAIRE ───
const runMigration = async () => {
  try {
    console.log("🚀 Tentative de migration sur Aiven...");
    // MySQL 8.0 (sur Aiven) supporte cette syntaxe simple
    await db.query("ALTER TABLE annonces ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE AFTER titre");
    console.log("✅ Colonne 'slug' vérifiée/ajoutée avec succès.");
  } catch (err) {
    // Si IF NOT EXISTS n'est pas supporté, on attrape l'erreur si la colonne existe déjà
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("ℹ️ La colonne 'slug' existe déjà.");
    } else {
      console.error("❌ Erreur SQL migration :", err.message);
    }
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