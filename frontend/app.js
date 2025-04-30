let map;
let polygon;
let markers = [];

const BASE_URL = 'https://ada-parsel-backend.onrender.com'; // kendi backend URL'in
const token = localStorage.getItem('token');

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 41.015, lng: 29.02 },
  });
  mapClickHandler(map);
}

function fetchDropdown(id, endpoint) {
  fetch(`${BASE_URL}/api/parsel/${endpoint}`, {
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById(id);
      select.innerHTML = '';
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.Id || item.id;
        opt.textContent = item.Adi || item.adi;
        select.appendChild(opt);
      });
    });
}

document.getElementById('ilSelect').addEventListener('change', () => {
  const ilId = document.getElementById('ilSelect').value;
  fetchDropdown('ilceSelect', `ilceler?ilId=${ilId}`);
});

document.getElementById('ilceSelect').addEventListener('change', () => {
  const ilId = document.getElementById('ilSelect').value;
  const ilceId = document.getElementById('ilceSelect').value;
  fetchDropdown('mahalleSelect', `mahalleler?ilId=${ilId}&ilceId=${ilceId}`);
});

document.getElementById('sorgulaBtn').addEventListener('click', () => {
  const ilId = document.getElementById('ilSelect').value;
  const ilceId = document.getElementById('ilceSelect').value;
  const mahalleId = document.getElementById('mahalleSelect').value;
  const ada = document.getElementById('adaInput').value;
  const parsel = document.getElementById('parselInput').value;

  fetch(`${BASE_URL}/api/parsel/parsel?ilId=${ilId}&ilceId=${ilceId}&mahalleId=${mahalleId}&ada=${ada}&parsel=${parsel}`, {
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      if (polygon) polygon.setMap(null);
      const coordinates = JSON.parse(data.geoJson).coordinates[0].map(([lng, lat]) => ({ lat, lng }));
      polygon = new google.maps.Polygon({
        paths: coordinates,
        strokeColor: '#3ecf00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3ecf00',
        fillOpacity: 0.35,
      });
      polygon.setMap(map);
      map.setCenter(coordinates[0]);
    })
    .catch(() => alert("Veri alınamadı: Sunucu hatası"));
});

function mapClickHandler(map) {
  map.addListener("click", (e) => {
    const pinColor = document.getElementById('pinColor').value;
    const pinText = document.getElementById('pinText').value;
    const boxColor = document.getElementById('boxColor').value;

    const marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
      icon: `http://maps.google.com/mapfiles/ms/icons/${pinColor}-dot.png`
    });
    markers.push(marker);

    const box = document.createElement("div");
    box.className = "marker-box";
    box.style.backgroundColor = boxColor;
    box.innerText = pinText;
    document.body.appendChild(box);

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = () => {
      const panes = overlay.getPanes();
      panes.overlayImage.appendChild(box);
    };
    overlay.draw = () => {
      const projection = overlay.getProjection();
      const position = projection.fromLatLngToDivPixel(e.latLng);
      box.style.left = position.x + "px";
      box.style.top = position.y + "px";
    };
    overlay.setMap(map);
  });
}

document.getElementById('indirBtn').addEventListener('click', () => {
  html2canvas(document.getElementById('map')).then(canvas => {
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append("image", blob, "harita.png");

      fetch(`${BASE_URL}/api/images/upload`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData
      });

      const link = document.createElement("a");
      link.download = "harita.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});

window.onload = () => {
  initMap();
  fetchDropdown('ilSelect', 'iller');
};
