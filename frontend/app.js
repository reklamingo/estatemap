
let map;
function initMap() {
    map = L.map('harita').setView([41.015137, 28.979530], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    map.on('click', function(e) {
        const marker = L.marker(e.latlng).addTo(map);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
}

function sorgula() {
    alert("Bu versiyonda demo polygon gösterilecektir.");
    const polygon = L.polygon([
        [41.015137, 28.979530],
        [41.025137, 28.989530],
        [41.035137, 28.979530]
    ]).addTo(map);
    map.fitBounds(polygon.getBounds());
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
};
