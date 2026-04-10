const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// ─── PUBLIC ────────────────────────────────────────────

// GET /api/annonces — liste avec filtres + tri
router.get('/', async (req, res) => {
  try {
    const {
      type_bien, type_transaction, gouvernorat,
      prix_min, prix_max, surface_min, nb_pieces,
      statut = 'active', page = 1, limit = 12,
      search, sort, order
    } = req.query;

    let where = ['a.statut = ?'];
    let params = [statut];

    if (type_bien)        { where.push('a.type_bien = ?');        params.push(type_bien); }
    if (type_transaction) { where.push('a.type_transaction = ?'); params.push(type_transaction); }
    if (gouvernorat)      { where.push('a.gouvernorat = ?');      params.push(gouvernorat); }
    if (prix_min)         { where.push('a.prix >= ?');            params.push(prix_min); }
    if (prix_max)         { where.push('a.prix <= ?');            params.push(prix_max); }
    if (surface_min)      { where.push('a.surface >= ?');         params.push(surface_min); }
    if (nb_pieces)        { where.push('a.nb_pieces >= ?');       params.push(nb_pieces); }
    if (search)           {
      where.push('(a.titre LIKE ? OR a.description LIKE ? OR a.ville LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Tri dynamique sécurisé
    const allowedSort  = ['prix', 'surface', 'created_at'];
    const allowedOrder = ['ASC', 'DESC'];
    const sortField = allowedSort.includes(sort)               ? sort  : 'created_at';
    const sortOrder = allowedOrder.includes(order?.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = where.join(' AND ');

    const sql = `
      SELECT a.*,
        (SELECT url FROM annonce_images
         WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
      FROM annonces a
      WHERE ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit), offset);

    const [annonces] = await db.query(sql, params);

    // Count total (sans LIMIT/OFFSET)
    const countParams = params.slice(0, -2);
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM annonces a WHERE ${whereClause}`,
      countParams
    );

    res.json({
      annonces,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// ⚠️ IMPORTANT : /admin/all AVANT /:id pour éviter le conflit de routes
// GET /api/annonces/admin/all
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    let where = '1=1';
    let params = [];

    if (statut) { where += ' AND statut = ?'; params.push(statut); }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [annonces] = await db.query(
      `SELECT a.*,
        (SELECT url FROM annonce_images
         WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
       FROM annonces a
       WHERE ${where}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM annonces WHERE ${where}`,
      params
    );

    res.json({ annonces, total });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/annonces/:id — détail
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM annonces WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Annonce introuvable' });

    const annonce = rows[0];
    const [images]   = await db.query(
      'SELECT * FROM annonce_images WHERE annonce_id = ? ORDER BY is_principale DESC',
      [annonce.id]
    );
    const [features] = await db.query(
      'SELECT feature FROM annonce_features WHERE annonce_id = ?',
      [annonce.id]
    );

    res.json({
      ...annonce,
      images,
      features: features.map(f => f.feature),
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// ─── ADMIN (protégé) ───────────────────────────────────

// POST /api/annonces — créer
router.post('/', auth, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const {
      titre, description, type_bien, type_transaction, prix,
      surface, nb_pieces, nb_chambres, nb_salles_bain,
      gouvernorat, ville, adresse, latitude, longitude,
      nom_contact, tel_contact, email_contact,
      statut = 'active', images = [], features = []
    } = req.body;

    const [result] = await conn.query(
      `INSERT INTO annonces
        (titre, description, type_bien, type_transaction, prix, surface,
         nb_pieces, nb_chambres, nb_salles_bain, gouvernorat, ville, adresse,
         latitude, longitude, nom_contact, tel_contact, email_contact, statut)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [titre, description, type_bien, type_transaction, prix, surface,
       nb_pieces, nb_chambres, nb_salles_bain, gouvernorat, ville, adresse,
       latitude, longitude, nom_contact, tel_contact, email_contact, statut]
    );

    const annonceId = result.insertId;

    for (let i = 0; i < images.length; i++) {
      await conn.query(
        'INSERT INTO annonce_images (annonce_id, url, is_principale) VALUES (?,?,?)',
        [annonceId, images[i], i === 0 ? 1 : 0]
      );
    }
    for (const feature of features) {
      await conn.query(
        'INSERT INTO annonce_features (annonce_id, feature) VALUES (?,?)',
        [annonceId, feature]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Annonce créée', id: annonceId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/annonces/:id — modifier
router.put('/:id', auth, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const {
      titre, description, type_bien, type_transaction, prix,
      surface, nb_pieces, nb_chambres, nb_salles_bain,
      gouvernorat, ville, adresse, latitude, longitude,
      nom_contact, tel_contact, email_contact, statut,
      images = [], features = []
    } = req.body;

    await conn.query(
      `UPDATE annonces SET
        titre=?, description=?, type_bien=?, type_transaction=?, prix=?,
        surface=?, nb_pieces=?, nb_chambres=?, nb_salles_bain=?, gouvernorat=?,
        ville=?, adresse=?, latitude=?, longitude=?, nom_contact=?,
        tel_contact=?, email_contact=?, statut=?
       WHERE id=?`,
      [titre, description, type_bien, type_transaction, prix, surface,
       nb_pieces, nb_chambres, nb_salles_bain, gouvernorat, ville, adresse,
       latitude, longitude, nom_contact, tel_contact, email_contact,
       statut, req.params.id]
    );

    await conn.query('DELETE FROM annonce_images   WHERE annonce_id=?', [req.params.id]);
    await conn.query('DELETE FROM annonce_features WHERE annonce_id=?', [req.params.id]);

    for (let i = 0; i < images.length; i++) {
      await conn.query(
        'INSERT INTO annonce_images (annonce_id, url, is_principale) VALUES (?,?,?)',
        [req.params.id, images[i], i === 0 ? 1 : 0]
      );
    }
    for (const feature of features) {
      await conn.query(
        'INSERT INTO annonce_features (annonce_id, feature) VALUES (?,?)',
        [req.params.id, feature]
      );
    }

    await conn.commit();
    res.json({ message: 'Annonce mise à jour' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

// PATCH /api/annonces/:id/statut — changer statut
router.patch('/:id/statut', auth, async (req, res) => {
  try {
    await db.query(
      'UPDATE annonces SET statut=? WHERE id=?',
      [req.body.statut, req.params.id]
    );
    res.json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// DELETE /api/annonces/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM annonces WHERE id=?', [req.params.id]);
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/annonces/admin/stats
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const [[total]]        = await db.query("SELECT COUNT(*) as v FROM annonces");
    const [[actives]]      = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='active'");
    const [[en_attente]]   = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='en_attente'");
    const [[inactives]]    = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='inactive'");
    const [[ventes]]       = await db.query("SELECT COUNT(*) as v FROM annonces WHERE type_transaction='vente' AND statut='active'");
    const [[locations]]    = await db.query("SELECT COUNT(*) as v FROM annonces WHERE type_transaction='location' AND statut='active'");
    const [[prixMoyen]]    = await db.query("SELECT AVG(prix) as v FROM annonces WHERE statut='active'");

    // Annonces par gouvernorat
    const [parGouv] = await db.query(
      `SELECT gouvernorat, COUNT(*) as total
       FROM annonces WHERE statut='active'
       GROUP BY gouvernorat ORDER BY total DESC LIMIT 5`
    );

    // Annonces des 6 derniers mois
    const [parMois] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as mois, COUNT(*) as total
       FROM annonces
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY mois ORDER BY mois ASC`
    );

    res.json({
      total: total.v,
      actives: actives.v,
      en_attente: en_attente.v,
      inactives: inactives.v,
      ventes: ventes.v,
      locations: locations.v,
      prix_moyen: Math.round(prixMoyen.v || 0),
      par_gouvernorat: parGouv,
      par_mois: parMois,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;