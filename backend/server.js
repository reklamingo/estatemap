
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/parsel', async (req, res) => {
  const { il, ilce, mahalle, ada, parsel } = req.query;
  if (!il || !ilce || !mahalle || !ada || !parsel) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  try {
    const url = `https://cbsservis.tkgm.gov.tr/arcgis/services/TKGM_Kadastro/MapServer/WFSServer?service=WFS&version=1.1.0&request=GetFeature&typeName=Kadastro_Parsel&outputFormat=application/json&CQL_FILTER=il_adi='${il}' AND ilce_adi='${ilce}' AND mahalle_adi='${mahalle}' AND ada_no=${ada} AND parsel_no=${parsel}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'TKGM servisine erişilemedi.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor.`);
});
