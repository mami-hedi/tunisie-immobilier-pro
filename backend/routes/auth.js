const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, nom: admin.nom },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, admin: { id: admin.id, nom: admin.nom, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;