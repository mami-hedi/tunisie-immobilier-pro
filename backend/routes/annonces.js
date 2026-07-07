const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

// ─── UTILITAIRES ───────────────────────────────────────

/**
 * Génère un slug unique et propre pour le SEO
 */
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

/**
 * Vérification dynamique de l'existence d'une colonne
 */
async function columnExists(table, column) {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column]
    );
    return rows[0].cnt > 0;
  } catch { return false; }
}

/**
 * Nettoie les données pour MySQL (évite les erreurs sur les types INT/FLOAT)
 */
const cleanData = (data) => {
  const numericFields = ['prix', 'surface', 'nb_pieces', 'nb_chambres', 'nb_salles_bain', 'latitude', 'longitude'];
  const cleaned = { ...data };
  numericFields.forEach(field => {
    if (cleaned[field] === "" || cleaned[field] === undefined || cleaned[field] === null) {
      cleaned[field] = null;
    }
  });
  return cleaned;
};

/**
 * Supprime en parallèle une liste de public_id Cloudinary.
 * Ne bloque jamais la requête principale si Cloudinary échoue.
 */
async function destroyCloudinaryImages(publicIds = []) {
  const ids = publicIds.filter(Boolean);
  if (ids.length === 0) return;
  try {
    await Promise.all(ids.map(pid => cloudinary.uploader.destroy(pid)));
  } catch (err) {
    console.error('Erreur suppression Cloudinary :', err.message);
  }
}

// ─── ROUTES PUBLIQUES ──────────────────────────────────

/**
 * GET /api/annonces
 * Liste filtrée et paginée pour le front-end
 */
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

    if (type_bien) { where.push('a.type_bien = ?'); params.push(type_bien); }
    if (type_transaction) { where.push('a.type_transaction = ?'); params.push(type_transaction); }
    if (gouvernorat) { where.push('a.gouvernorat = ?'); params.push(gouvernorat); }
    if (prix_min) { where.push('a.prix >= ?'); params.push(prix_min); }
    if (prix_max) { where.push('a.prix <= ?'); params.push(prix_max); }
    if (surface_min) { where.push('a.surface >= ?'); params.push(surface_min); }
    if (nb_pieces) { where.push('a.nb_pieces >= ?'); params.push(nb_pieces); }
    if (search) {
      where.push('(a.titre LIKE ? OR a.description LIKE ? OR a.ville LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const allowedSort = ['prix', 'surface', 'created_at'];
    const sortField = allowedSort.includes(sort) ? sort : 'created_at';
    const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const limitVal = Math.max(1, parseInt(limit) || 12);
    const offset = Math.max(0, (parseInt(page) - 1) * limitVal);
    const whereClause = where.join(' AND ');

    const sql = `
      SELECT a.*, 
        (SELECT url FROM annonce_images 
         WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
      FROM annonces a
      WHERE ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT ${limitVal} OFFSET ${offset}
    `;

    const [annonces] = await db.query(sql, params);
    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM annonces a WHERE ${whereClause}`, params);

    res.json({ 
      annonces, 
      total: countRows[0]?.total || 0, 
      page: parseInt(page) || 1, 
      limit: limitVal 
    });
  } catch (err) {
    console.error("Erreur GET /annonces :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/**
 * GET /api/annonces/slug/:slug
 * Récupération SEO-friendly
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM annonces WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ message: 'Annonce introuvable' });

    const annonce = rows[0];
    const [images] = await db.query(
      'SELECT id, url, public_id AS publicId, is_principale FROM annonce_images WHERE annonce_id = ? ORDER BY is_principale DESC',
      [annonce.id]
    );
    const [features] = await db.query('SELECT feature FROM annonce_features WHERE annonce_id = ?', [annonce.id]);

    if (await columnExists('annonces', 'nb_vues')) {
      await db.query('UPDATE annonces SET nb_vues = nb_vues + 1 WHERE id = ?', [annonce.id]);
    }

    res.json({ ...annonce, images, features: features.map(f => f.feature) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/**
 * GET /api/annonces/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM annonces WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Annonce introuvable' });

    const annonce = rows[0];
    const [images] = await db.query(
      'SELECT id, url, public_id AS publicId, is_principale FROM annonce_images WHERE annonce_id = ? ORDER BY is_principale DESC',
      [annonce.id]
    );
    const [features] = await db.query('SELECT feature FROM annonce_features WHERE annonce_id = ?', [annonce.id]);

    res.json({ ...annonce, images, features: features.map(f => f.feature) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// ─── ROUTES ADMIN (PROTÉGÉES) ──────────────────────────

/**
 * GET /api/annonces/admin/all
 */
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { statut, type_transaction, type_bien, page = 1, limit = 20, search } = req.query;
    let where = ['1=1'];
    let params = [];

    if (statut) { 
      where.push('statut = ?'); 
      params.push(statut); 
    }
    
    if (type_transaction) { 
      where.push('type_transaction = ?'); 
      params.push(type_transaction); 
    }

    if (type_bien) {
      where.push('type_bien = ?');
      params.push(type_bien);
    }
    
    if (search) {
      where.push('(titre LIKE ? OR ville LIKE ? OR gouvernorat LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const limitVal = parseInt(limit);
    const offset = (parseInt(page) - 1) * limitVal;
    const whereClause = where.join(' AND ');

    const [annonces] = await db.query(
      `SELECT a.*, 
        (SELECT url FROM annonce_images WHERE annonce_id = a.id AND is_principale = 1 LIMIT 1) AS image_principale
       FROM annonces a WHERE ${whereClause} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limitVal, offset]
    );

    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM annonces WHERE ${whereClause}`, params);
    res.json({ annonces, total: countRows[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/**
 * GET /api/annonces/admin/stats
 */
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
      `SELECT gouvernorat, COUNT(*) as total FROM annonces WHERE statut='active' 
       GROUP BY gouvernorat ORDER BY total DESC LIMIT 5`
    );

    const [parMois] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as mois, COUNT(*) as total
       FROM annonces WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
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
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/**
 * POST /api/annonces
 * Création complète avec transaction SQL
 * req.body.images attendu sous la forme : [{ url, publicId }, ...]
 */
router.post('/', auth, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const cleanBody = cleanData(req.body);
    const { images = [], features = [], ...fields } = cleanBody;

    // Insertion principale
    const [result] = await conn.query(`INSERT INTO annonces SET ?`, [fields]);
    const annonceId = result.insertId;

    // Génération du Slug
    const hasSlug = await columnExists('annonces', 'slug');
    const slugValue = `${slugify(fields.titre)}-${annonceId}`;
    if (hasSlug) {
      await conn.query('UPDATE annonces SET slug = ? WHERE id = ?', [slugValue, annonceId]);
    }

    // Insertion Images (Cloudinary : url + public_id)
    if (images.length > 0) {
      const imgQueries = images.map((img, i) =>
        conn.query(
          'INSERT INTO annonce_images (annonce_id, url, public_id, is_principale) VALUES (?,?,?,?)',
          [annonceId, img.url, img.publicId || null, i === 0 ? 1 : 0]
        )
      );
      await Promise.all(imgQueries);
    }

    // Insertion Features
    if (features.length > 0) {
      const featQueries = features.map(f => 
        conn.query('INSERT INTO annonce_features (annonce_id, feature) VALUES (?,?)', [annonceId, f])
      );
      await Promise.all(featQueries);
    }

    await conn.commit();
    res.status(201).json({ message: 'Annonce créée avec succès', id: annonceId, slug: slugValue });
  } catch (err) {
    await conn.rollback();
    console.error("Erreur création annonce :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

/**
 * PUT /api/annonces/:id
 * req.body.images attendu sous la forme : [{ url, publicId }, ...]
 * Les images retirées par l'utilisateur sont automatiquement supprimées de Cloudinary.
 */
router.put('/:id', auth, async (req, res) => {
  const conn = await db.getConnection();
  const annonceId = req.params.id;
  try {
    await conn.beginTransaction();
    const cleanBody = cleanData(req.body);
    const { images = [], features = [], ...fields } = cleanBody;

    // Mise à jour du slug si titre modifié
    const hasSlug = await columnExists('annonces', 'slug');
    if (hasSlug && fields.titre) {
      fields.slug = `${slugify(fields.titre)}-${annonceId}`;
    }

    // Update table principale
    await conn.query('UPDATE annonces SET ? WHERE id = ?', [fields, annonceId]);

    // Récupère les anciennes images pour savoir lesquelles ont été retirées
    const [oldImages] = await conn.query(
      'SELECT public_id AS publicId FROM annonce_images WHERE annonce_id = ?',
      [annonceId]
    );
    const newPublicIds = new Set(images.map(img => img.publicId).filter(Boolean));
    const removedPublicIds = oldImages
      .map(img => img.publicId)
      .filter(pid => pid && !newPublicIds.has(pid));

    // Refresh Images (Supprimer puis ré-insérer)
    await conn.query('DELETE FROM annonce_images WHERE annonce_id = ?', [annonceId]);
    if (images.length > 0) {
      const imgQueries = images.map((img, i) =>
        conn.query(
          'INSERT INTO annonce_images (annonce_id, url, public_id, is_principale) VALUES (?,?,?,?)',
          [annonceId, img.url, img.publicId || null, i === 0 ? 1 : 0]
        )
      );
      await Promise.all(imgQueries);
    }

    // Refresh Features
    await conn.query('DELETE FROM annonce_features WHERE annonce_id = ?', [annonceId]);
    if (features.length > 0) {
      const featQueries = features.map(f => 
        conn.query('INSERT INTO annonce_features (annonce_id, feature) VALUES (?,?)', [annonceId, f])
      );
      await Promise.all(featQueries);
    }

    await conn.commit();

    // Nettoyage Cloudinary après le commit (ne bloque pas la réponse en cas d'échec)
    destroyCloudinaryImages(removedPublicIds);

    res.json({ message: 'Annonce mise à jour', slug: fields.slug || null });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
});

/**
 * PATCH /api/annonces/:id/statut
 */
router.patch('/:id/statut', auth, async (req, res) => {
  try {
    await db.query('UPDATE annonces SET statut = ? WHERE id = ?', [req.body.statut, req.params.id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/**
 * DELETE /api/annonces/:id
 * Nettoie aussi les images correspondantes sur Cloudinary.
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const [images] = await db.query(
      'SELECT public_id AS publicId FROM annonce_images WHERE annonce_id = ?',
      [req.params.id]
    );

    // Les lignes annonce_images/annonce_features suivent via ON DELETE CASCADE
    await db.query('DELETE FROM annonces WHERE id = ?', [req.params.id]);

    await destroyCloudinaryImages(images.map(img => img.publicId));

    res.json({ message: 'Annonce supprimée définitivement' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;