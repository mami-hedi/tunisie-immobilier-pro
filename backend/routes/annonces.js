const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// ─── Utilitaire slug ───────────────────────────────────
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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
    if (prix_min)         { where.push('a.prix >= ?');             params.push(prix_min); }
    if (prix_max)         { where.push('a.prix <= ?');             params.push(prix_max); }
    if (surface_min)      { where.push('a.surface >= ?');          params.push(surface_min); }
    if (nb_pieces)        { where.push('a.nb_pieces >= ?');        params.push(nb_pieces); }
    if (search) {
      where.push('(a.titre LIKE ? OR a.description LIKE ? OR a.ville LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const allowedSort  = ['prix', 'surface', 'created_at'];
    const allowedOrder = ['ASC', 'DESC'];
    const sortField = allowedSort.includes(sort) ? sort : 'created_at';
    const sortOrder = allowedOrder.includes(order?.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const limitVal = parseInt(limit) || 12;
    const pageVal = parseInt(page) || 1;
    const offset = (pageVal - 1) * limitVal;
    const whereClause = where.join(' AND ');

    // 1. Récupérer les annonces
    const sql = `
      SELECT a.*,
        (SELECT url FROM annonce_images
         WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
      FROM annonces a
      WHERE ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const [annonces] = await db.query(sql, [...params, limitVal, offset]);

    // 2. Récupérer le total (Correction de la déstructuration)
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM annonces a WHERE ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    res.json({ 
      annonces, 
      total, 
      page: pageVal, 
      limit: limitVal 
    });

  } catch (err) {
    console.error("Erreur GET /api/annonces :", err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des annonces', error: err.message });
  }
});

// ⚠️ Routes statiques AVANT /:id

// GET /api/annonces/admin/all
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { statut, page = 1, limit = 20, search } = req.query;
    let where = ['1=1'];
    let params = [];

    if (statut) { where.push('statut = ?'); params.push(statut); }
    if (search) {
      where.push('(titre LIKE ? OR ville LIKE ? OR gouvernorat LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const limitVal = parseInt(limit) || 20;
    const pageVal = parseInt(page) || 1;
    const offset = (pageVal - 1) * limitVal;
    const whereClause = where.join(' AND ');

    const [annonces] = await db.query(
      `SELECT a.*,
        (SELECT url FROM annonce_images
         WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
       FROM annonces a
       WHERE ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitVal, offset]
    );

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM annonces WHERE ${whereClause}`,
      params
    );

    res.json({ annonces, total: countRows[0]?.total || 0 });
  } catch (err) {
    console.error("Erreur GET /admin/all :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/annonces/admin/stats
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const [total]      = await db.query("SELECT COUNT(*) as v FROM annonces");
    const [actives]    = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='active'");
    const [en_attente] = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='en_attente'");
    const [inactives]  = await db.query("SELECT COUNT(*) as v FROM annonces WHERE statut='inactive'");
    const [ventes]     = await db.query("SELECT COUNT(*) as v FROM annonces WHERE type_transaction='vente' AND statut='active'");
    const [locations]  = await db.query("SELECT COUNT(*) as v FROM annonces WHERE type_transaction='location' AND statut='active'");
    const [prixMoyen]  = await db.query("SELECT AVG(prix) as v FROM annonces WHERE statut='active'");

    const [parGouv] = await db.query(
      `SELECT gouvernorat, COUNT(*) as total
       FROM annonces WHERE statut='active'
       GROUP BY gouvernorat ORDER BY total DESC LIMIT 5`
    );

    const [parMois] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as mois, COUNT(*) as total
       FROM annonces
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY mois ORDER BY mois ASC`
    );

    res.json({
      total: total[0]?.v || 0,
      actives: actives[0]?.v || 0,
      en_attente: en_attente[0]?.v || 0,
      inactives: inactives[0]?.v || 0,
      ventes: ventes[0]?.v || 0,
      locations: locations[0]?.v || 0,
      prix_moyen: Math.round(prixMoyen[0]?.v || 0),
      par_gouvernorat: parGouv,
      par_mois: parMois,
    });
  } catch (err) {
    console.error("Erreur GET /admin/stats :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/annonces/slug/:slug — détail par slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM annonces WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Annonce introuvable' });

    const annonce = rows[0];
    const [images] = await db.query(
      'SELECT * FROM annonce_images WHERE annonce_id = ? ORDER BY is_principale DESC',
      [annonce.id]
    );
    const [features] = await db.query(
      'SELECT feature FROM annonce_features WHERE annonce_id = ?',
      [annonce.id]
    );

    await db.query('UPDATE annonces SET nb_vues = nb_vues + 1 WHERE id = ?', [annonce.id]);

    res.json({ ...annonce, images, features: features.map(f => f.feature) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/annonces/:id — détail par id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM annonces WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Annonce introuvable' });

    const annonce = rows[0];
    const [images] = await db.query(
      'SELECT * FROM annonce_images WHERE annonce_id = ? ORDER BY is_principale DESC',
      [annonce.id]
    );
    const [features] = await db.query(
      'SELECT feature FROM annonce_features WHERE annonce_id = ?',
      [annonce.id]
    );

    res.json({ ...annonce, images, features: features.map(f => f.feature) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// ─── ADMIN (protégé) ───────────────────────────────────

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
    const slug = slugify(titre) + '-' + annonceId;
    await conn.query('UPDATE annonces SET slug = ? WHERE id = ?', [slug, annonceId]);

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
    res.status(201).json({ message: 'Annonce créée', id: annonceId, slug });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

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

    const slug = slugify(titre) + '-' + req.params.id;

    await conn.query(
      `UPDATE annonces SET
        titre=?, description=?, type_bien=?, type_transaction=?, prix=?,
        surface=?, nb_pieces=?, nb_chambres=?, nb_salles_bain=?, gouvernorat=?,
        ville=?, adresse=?, latitude=?, longitude=?, nom_contact=?,
        tel_contact=?, email_contact=?, statut=?, slug=?
       WHERE id=?`,
      [titre, description, type_bien, type_transaction, prix, surface,
       nb_pieces, nb_chambres, nb_salles_bain, gouvernorat, ville, adresse,
       latitude, longitude, nom_contact, tel_contact, email_contact,
       statut, slug, req.params.id]
    );

    await conn.query('DELETE FROM annonce_images WHERE annonce_id=?', [req.params.id]);
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
    res.json({ message: 'Annonce mise à jour', slug });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

router.patch('/:id/statut', auth, async (req, res) => {
  try {
    await db.query('UPDATE annonces SET statut=? WHERE id=?', [req.body.statut, req.params.id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM annonces WHERE id=?', [req.params.id]);
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;