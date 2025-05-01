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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/parsel', require('./routes/parsel'));
app.use('/api/images', require('./routes/images'));

mongoose.connect(process.env.MONGO_URI)
  useNewUrlParser: true,
  useUnifiedTopology: true,
  .then(() => {
    app.listen(PORT, () => {
      console.log('Sunucu çalışıyor: ' + PORT);
    });
  })
  .catch(err => console.log('Mongo bağlantı hatası:', err));
