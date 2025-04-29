let map;
let markers = [];

function initMap() {
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, Earthstar Geographics'
  });

  const esriRoad = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  });

  map = L.map('harita', {
    center: [41.015137, 28.979530],
    zoom: 13,
    layers: [esriSatellite]
  });

  const baseMaps = {
    "Esri Uydu Görüntüsü": esriSatellite,
    "Esri Yol Haritası": esriRoad
  };

  L.control.layers(baseMaps).addTo(map);

  map.on('click', function(e) {
    const iconSelection = prompt('İşaret ekle: 🏫=Okul, 🛒=Market, 🌳=Park, 🏥=Hastane, 🚏=Durağı');
    if (iconSelection) {
      const marker = L.marker(e.latlng).addTo(map).bindPopup(iconSelection).openPopup();
      markers.push(marker);
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function sorgula() {
  const il = document.getElementById('il').value;
  const ilce = document.getElementById('ilce').value;
  const mahalle = document.getElementById('mahalle').value;
  const ada = document.getElementById('ada').value;
  const parsel = document.getElementById('parsel').value;

  fetch(`https://ada-parsel-backend.onrender.com/parsel?il=${il}&ilce=${ilce}&mahalle=${mahalle}&ada=${ada}&parsel=${parsel}`)
  .then(response => response.json())
  .then(data => {
    if (data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates[0].map(c => [c[1], c[0]]);
      const polygon = L.polygon(coords, { color: 'green' }).addTo(map);
      map.fitBounds(polygon.getBounds());
    } else {
      alert('Parsel bulunamadı!');
    }
  })
  .catch(error => {
    console.error(error);
    alert('Bir hata oluştu.');
  });
}

function indir() {
  html2canvas(document.querySelector("#harita")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'parsel.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

window.onload = function() {
  initMap();
  populateIller();
};

function populateIller() {
  const ilSelect = document.getElementById('il');
  ilSelect.innerHTML = '<option value="">İl Seçiniz</option>';
  for (const il in iller) {
    ilSelect.innerHTML += `<option value="${il}">${il}</option>`;
  }

  ilSelect.addEventListener('change', function() {
    const ilceSelect = document.getElementById('ilce');
    ilceSelect.innerHTML = '<option value="">İlçe Seçiniz</option>';
    const selectedIl = ilSelect.value;
    if (iller[selectedIl]) {
      for (const ilce in iller[selectedIl]) {
        ilceSelect.innerHTML += `<option value="${ilce}">${ilce}</option>`;
      }
    }
    document.getElementById('mahalle').innerHTML = '<option value="">Mahalle Seçiniz</option>';
  });

  document.getElementById('ilce').addEventListener('change', function() {
    const mahalleSelect = document.getElementById('mahalle');
    mahalleSelect.innerHTML = '<option value="">Mahalle Seçiniz</option>';
    const selectedIl = ilSelect.value;
    const selectedIlce = document.getElementById('ilce').value;
    if (iller[selectedIl] && iller[selectedIl][selectedIlce]) {
      iller[selectedIl][selectedIlce].forEach(mahalle => {
        mahalleSelect.innerHTML += `<option value="${mahalle}">${mahalle}</option>`;
      });
    }
  });
}
