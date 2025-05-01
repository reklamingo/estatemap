const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Kullanıcı doğrulama middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token eksik' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token geçersiz' });
  }
};

// Upload klasörü
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Görsel yükle
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  const image = await prisma.image.create({
    data: {
      filename: req.file.filename,
      userId: req.user.userId
    }
  });

  res.json({ message: 'Görsel yüklendi', image });
});

// Kullanıcının geçmiş görselleri
router.get('/my-images', auth, async (req, res) => {
  const images = await prisma.image.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' }
  });

  res.json(images);
});

module.exports = router;
