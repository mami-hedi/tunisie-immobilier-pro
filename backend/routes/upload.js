const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/authMiddleware');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tunisie-immobilier',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  }
});

// POST /api/upload (multi-image)
router.post('/', auth, upload.array('images', 10), (req, res) => {
  const urls = req.files.map(f => f.path);         // URL https complète Cloudinary
  const publicIds = req.files.map(f => f.filename); // public_id Cloudinary (pour suppression future)
  res.json({ urls, publicIds });
});

// DELETE /api/upload — supprime une image du CDN Cloudinary
router.delete('/', auth, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ message: 'publicId requis' });
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;