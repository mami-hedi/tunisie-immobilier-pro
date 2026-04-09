const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://192.168.1.13:8080'],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));