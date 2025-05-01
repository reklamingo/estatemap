let map;
let markers = [];

function initMap() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.92077, lng: 32.85411 }, // Ankara merkez
    zoom: 6,
  });

  map.addListener("click", (e) => {
    const pinType = window.currentPinType || 'kirmizi';
    addMarker(e.latLng, pinType);
  });
}

function addPin(type) {
  window.currentPinType = type;
  alert(`${type} pin moduna geçildi. Haritaya tıklayarak bırakabilirsiniz.`);
}

function addMarker(position, color) {
  const pinColors = {
    kirmizi: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    mavi: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    sari: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    beyaz: 'http://maps.google.com/mapfiles/ms/icons/white-dot.png'
  };

  const marker = new google.maps.Marker({
    position,
    map,
    icon: pinColors[color] || pinColors.kirmizi
  });

  markers.push(marker);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

function downloadMap() {
  html2canvas(document.getElementById('map')).then(canvas => {
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, 'harita.png');

      const token = localStorage.getItem('token');
      fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }).then(res => res.json())
        .then(data => {
          alert('Harita görseli indirildi ve yüklendi.');
        });
    });

    const link = document.createElement('a');
    link.download = 'harita.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}
