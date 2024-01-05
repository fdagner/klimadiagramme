 // Koordinaten für den Marker
 const markerCoordinates = [parseFloat(latData), parseFloat(lonData)]; // Koordinaten in Zahlen umwandeln

 // Erstelle die Leaflet-Karte
 const myMap = L.map("map",{
minZoom: 1,
maxZoom: 4, // Du kannst diesen Wert je nach Bedarf anpassen
}).setView(markerCoordinates, 1);

 // Füge die OpenStreetMap-Basiskarte hinzu
 L.tileLayer("js/map/{z}/{x}/{y}.png", {
attribution: 'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, SRTM | Kartendarstellung: <a href="https://opentopomap.org/">© OpenTopoMap</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/">(CC-BY-SA)</a>',
}).addTo(myMap);

 // Füge einen Marker mit benutzerdefiniertem Icon hinzu
 const customIcon = L.icon({
   iconUrl: 'img/ts-map-pin.svg',
   iconSize: [32, 32], // Größe des Icons in Pixel
   iconAnchor: [16, 28], // Position des Ankers relativ zur Icon-Position
 });

 // Füge den Marker hinzu
 L.marker(markerCoordinates, { icon: customIcon }).addTo(myMap);

 // Funktion zum Aktualisieren der Leaflet-Karte basierend auf den neuen Koordinaten
 function updateLeafletMap() {
   // Neue Koordinaten
   const newLatLng = L.latLng(parseFloat(latData), parseFloat(lonData));

   // Entferne bestehende Marker, um doppelte Marker zu vermeiden
   myMap.eachLayer((layer) => {
     if (layer instanceof L.Marker) {
       layer.remove();
     }
   });

   // Füge den neuen Marker hinzu
   L.marker(newLatLng, { icon: customIcon }).addTo(myMap);

   // Aktualisiere die Karte
   myMap.setView(newLatLng, 1);
 }