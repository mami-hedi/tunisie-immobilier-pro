const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. Mise à jour du CORS pour inclure Vercel
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080', 
    'https://tunisie-immobilier-pro.vercel.app/' // 🚩 REMPLACE PAR TON URL VERCEL
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

const PORT = process.env.PORT || 10000; // Render utilise souvent le port 10000

// 2. Écouter sur '0.0.0.0' pour être accessible sur Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});