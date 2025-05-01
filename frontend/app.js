let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.9208, lng: 32.8541 }, // Ankara
    zoom: 6,
  });
}

function sorgula() {
  const il = document.getElementById("il").value;
  const ilce = document.getElementById("ilce").value;
  const mahalle = document.getElementById("mahalle").value;
  const ada = document.getElementById("ada").value;
  const parsel = document.getElementById("parsel").value;

  if (!il || !ilce || !mahalle || !ada || !parsel) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  // Buraya API sorgusu yapılabilir
  console.log("Sorgulanan:", { il, ilce, mahalle, ada, parsel });
}

function downloadMap() {
  html2canvas(document.getElementById("map")).then(canvas => {
    const link = document.createElement("a");
    link.download = "harita.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
