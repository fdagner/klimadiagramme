 // Coordinates for the marker
 const markerCoordinates = [parseFloat(latData), parseFloat(lonData)]; // Koordinaten in Zahlen umwandeln

 // Create the leaflet card
 const myMap = L.map("map",{
minZoom: 1,
maxZoom: 4,
}).setView(markerCoordinates, 1);

 // Add the OpenStreetMap basemap
 L.tileLayer("js/map/{z}/{x}/{y}.png", {
attribution: 'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, SRTM | Kartendarstellung: <a href="https://opentopomap.org/">© OpenTopoMap</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/">(CC-BY-SA)</a>',
}).addTo(myMap);

// Add a marker with a user-defined icon
 const customIcon = L.icon({
   iconUrl: 'img/ts-map-pin.svg',
   iconSize: [32, 32], 
   iconAnchor: [16, 28], //Position of the anchor relative to the icon position
 });

// Add the marker
 L.marker(markerCoordinates, { icon: customIcon }).addTo(myMap);

// Function for updating the leaflet map based on the new coordinates
 function updateLeafletMap() {
 // New coordinates
   const newLatLng = L.latLng(parseFloat(latData), parseFloat(lonData));

   // Remove existing markers to avoid duplicate markers
   myMap.eachLayer((layer) => {
     if (layer instanceof L.Marker) {
       layer.remove();
     }
   });

   // Add the new marker
   L.marker(newLatLng, { icon: customIcon }).addTo(myMap);

   // Update the map
   myMap.setView(newLatLng, 1);
 }