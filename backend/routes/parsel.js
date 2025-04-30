const express = require('express');
const soap = require('soap');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// TKGM WSDL dosyası (senin projenin root'una koyulmalı)
const wsdlUrl = 'https://tkgm.gov.tr/servis/ParselSorguService.svc?wsdl';

// JWT kontrol middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetkisiz' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Geçersiz token' });
  }
};

// İl, ilçe, mahalle listeleri örnek sabit olarak (dilersen DB'den çektirebiliriz)
const iller = [
  { id: '34', adi: 'İstanbul' },
  { id: '06', adi: 'Ankara' }
];
const ilceler = {
  '34': [{ id: '01', adi: 'Üsküdar' }, { id: '02', adi: 'Kadıköy' }]
};
const mahalleler = {
  '34-01': [{ id: 'Altunizade', adi: 'Altunizade' }]
};

// --- endpointler ---

router.get('/iller', auth, (req, res) => res.json(iller));

router.get('/ilceler', auth, (req, res) => {
  const ilId = req.query.ilId;
  res.json(ilceler[ilId] || []);
});

router.get('/mahalleler', auth, (req, res) => {
  const { ilId, ilceId } = req.query;
  res.json(mahalleler[`${ilId}-${ilceId}`] || []);
});

// --- polygon verisi çek ---
router.get('/parsel', auth, (req, res) => {
  const { ilId, ilceId, mahalleId, ada, parsel } = req.query;

  // Burada gerçek TKGM SOAP isteği yapılacak
  // Şimdilik örnek polygon (Üsküdar'dan bir yer)
  const fakeGeoJSON = JSON.stringify({
    type: "Polygon",
    coordinates: [[
      [29.0451, 41.0221],
      [29.0453, 41.0221],
      [29.0453, 41.0223],
      [29.0451, 41.0223],
      [29.0451, 41.0221]
    ]]
  });

  res.json({ geoJson: fakeGeoJSON });
});

module.exports = router;
