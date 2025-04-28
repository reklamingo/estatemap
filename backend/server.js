
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Çalışıyor!');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
