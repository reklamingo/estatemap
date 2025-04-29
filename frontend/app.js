let map;
let markers = [];
let polygons = [];
let currentMapType = "satellite"; // Başlangıç uydu

function initMap() {
  map = new google.maps.Map(document.getElementById("harita"), {
    center: { lat: 41.015137, lng: 28.979530 }, // İstanbul merkez
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
  });

  map.addListener("click", (e) => {
    const iconSelection = prompt("İşaret ekle: 🏫=Okul, 🛒=Market, 🌳=Park, 🏥=Hastane, 🚏=Durağı");
    if (iconSelection) {
      const marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        label: iconSelection,
      });
      markers.push(marker);
    }
  });
}

function toggleMapType() {
  if (currentMapType === "satellite") {
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    currentMapType = "roadmap";
  } else {
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    currentMapType = "satellite";
  }
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
        const coords = data.features[0].geometry.coordinates[0].map(c => ({ lat: c[1], lng: c[0] }));

        // Önce eski polygonları temizle
        polygons.forEach(poly => poly.setMap(null));
        polygons = [];

        const polygon = new google.maps.Polygon({
          paths: coords,
          strokeColor: "#3ecf00",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3ecf00",
          fillOpacity: 0.2,
        });
        polygon.setMap(map);
        polygons.push(polygon);

        // Parsel görünür olacak şekilde zoom yap
        const bounds = new google.maps.LatLngBounds();
        coords.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);
      } else {
        alert('Parsel bulunamadı!');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Bir hata oluştu.');
    });
}

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

window.onload = populateIller;
