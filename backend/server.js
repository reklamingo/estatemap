
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

  // Encode tüm parametreleri
  const encodedIl = encodeURIComponent(il);
  const encodedIlce = encodeURIComponent(ilce);
  const encodedMahalle = encodeURIComponent(mahalle);

  const url = `https://cbsservis.tkgm.gov.tr/arcgis/services/TKGM_Kadastro/MapServer/WFSServer?service=WFS&version=1.1.0&request=GetFeature&typeName=Kadastro_Parsel&outputFormat=application/json&CQL_FILTER=il_adi='${encodedIl}' AND ilce_adi='${encodedIlce}' AND mahalle_adi='${encodedMahalle}' AND ada_no=${ada} AND parsel_no=${parsel}`;

  console.log("TKGM sorgusu:", url);

  try {
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error("TKGM Hatası:", error.response?.data || error.message);
    res.status(500).json({ error: 'TKGM servisine erişilemedi.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor.`);
});
