const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Image = require('../models/Image');
const User = require('../models/User');
const path = require('path');

const router = express.Router();

// Upload klasörü
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  }
});
const upload = multer({ storage });

// PNG upload
router.post('/upload', upload.single('image'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await Image.create({
    user: decoded.id,
    filename: req.file.filename
  });

  res.json({ message: 'Yüklendi' });
});

// Geçmiş görseller
router.get('/my-images', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const images = await Image.find({ user: decoded.id });
  res.json(images);
});

module.exports = router;
