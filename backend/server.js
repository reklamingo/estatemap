const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotalar
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parsel', require('./routes/parsel'));
app.use('/api/images', require('./routes/images'));

// MongoDB bağlantısı ve sunucunun ayağa kalkması
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Sunucu çalışıyor: ' + PORT);
    });
  })
  .catch(err => console.log('Mongo bağlantı hatası:', err));
