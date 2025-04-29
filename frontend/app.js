let map;
let markers = [];

function initMap() {
  const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=AIzaSyD9cmP1cnl80fu5jUg3WZvzSB9yZI_AC90', {
    attribution: 'Map data © Google'
  });

  const googleRoad = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyD9cmP1cnl80fu5jUg3WZvzSB9yZI_AC90', {
    attribution: 'Map data © Google'
  });

  map = L.map('harita', {
    layers: [googleSatellite] // Başlangıçta Uydu
  }).setView([41.015137, 28.979530], 13);

  const baseMaps = {
    "Uydu Görüntüsü (Google)": googleSatellite,
    "Yol Haritası (Google)": googleRoad
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
