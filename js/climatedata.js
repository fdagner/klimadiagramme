var geodaten = []; // Das Array, um die CSV-Daten zu speichern
var myChart; // Das Diagrammobjekt
let ortData = "Musterhausen";
let hoeheData = "300";
let lonData = "10";
let latData = "40";
// Funktion zum Aktualisieren des Dateinamens basierend auf dem aktuellen Ort
function updateFileName() {
  // Entferne alle Punkte und Sonderzeichen aus dem Ort
  var cleanOrt = ortData
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "_");
  var fileName = cleanOrt + ".png";
  var downloadButton = document.getElementById("downloadButton");
  downloadButton.download = fileName;
}
// Funktion zum Anzeigen von Daten nach Auswahl des Orts
function anzeigenNachOrt() {
  var selectedOrtId = document.getElementById("ortAuswahl").value;

  // Suchen Sie im Array nach den Daten für den ausgewählten Ort
  var datensatz = geodaten.find(function (datensatz) {
    return datensatz.ID === selectedOrtId;
  });

  // Überprüfen, ob der Datensatz gefunden wurde
  if (datensatz) {
    // Extrahieren Sie die Spaltenüberschriften
    var spalten = Object.keys(datensatz);
    ortData = datensatz["Ort"];
    hoeheData = datensatz["Hoehenlage"];
    lonData = datensatz["Laengengrad"];
    latData = datensatz["Breitengrad"];
   
    // Fügen Sie die Niederschlagsdaten in das precipitationData-Array ein
    for (var i = 16; i <= 27; i++) {
      var niederschlag = parseFloat(datensatz[spalten[i]].replace(",", "."));

      // Überprüfen Sie auf ungültige Werte
      if (!isNaN(niederschlag)) {
        precipitationData[i - 16] = niederschlag;
      } else {
        console.warn("Ungültiger Wert für Spalte " + (i + 1));
        precipitationData[i - 16] = null; // Fügen Sie null oder einen anderen Wert für ungültige Daten hinzu
        updateFileName();
      }
    }

    // Extrahieren Sie die Temperaturdaten und fügen Sie sie in das temperatureData-Array ein
    for (var j = 4; j <= 15; j++) {
      var temperatur = parseFloat(datensatz[spalten[j]].replace(",", "."));

      // Überprüfen Sie auf ungültige Werte
      if (!isNaN(temperatur)) {
        temperatureData[j - 4] = temperatur;
      } else {
        console.warn("Ungültiger Wert für Temperatur in Spalte " + (j + 1));
        temperatureData[j - 4] = null; // Fügen Sie null oder einen anderen Wert für ungültige Daten hinzu
      }
    }

    // Jetzt ist das precipitationData-Array mit den Niederschlagsdaten und temperatureData-Array mit den Temperaturdaten gefüllt
    console.log("Niederschlagsdaten Array: ", precipitationData);
    console.log("Temperaturdaten Array: ", temperatureData);
    const temperatureSum = temperatureData.reduce(
      (acc, temperature) => acc + temperature,
      0
    );

    const temperatureAverage = temperatureSum / temperatureData.length;
    const roundedAverage = temperatureAverage.toFixed(1);
    const precipitationSum = precipitationData.reduce(
      (acc, precipitation) => acc + precipitation,
      0
    );
    const roundedPrecipitation = precipitationSum.toFixed(0);
    (myChart.options.plugins.subtitle.text =
      "T: " +
      roundedAverage +
      "° C " +
      "    N: " +
      roundedPrecipitation +
      " mm    " +
      hoeheData +
      "m. ü. NN"),
      (myChart.options.plugins.title.text = ortData);

    (myChart.options.scales.y1.max =
      100 + Math.ceil(Math.max(700, ...precipitationData) / 100) * 10),
      (myChart.options.scales.y1.min =
        -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10),
      (myChart.options.scales.y2.max =
        100 + Math.ceil(Math.max(700, ...precipitationData) / 100) * 10),
      (myChart.options.scales.y2.min =
        -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10),
      // Aktualisieren Sie das Diagramm mit den neuen Daten
      myChart.options.scales.x.title.display = true;
      updateChart();
    updateFileName();
    document.getElementById("showOrtCheckbox").checked = true;
    updateLeafletMap();
  } else {
    console.error("Datensatz für ausgewählten Ort nicht gefunden.");
  }
}

// Funktion zum Aktualisieren des Diagramms mit den neuen Daten
function updateChart() {
  config.data.datasets[1].data = precipitationData.map((value) =>
    Math.min(value, 100)
  );
  config.data.datasets[2].data = precipitationData.map(
    (value) => Math.max(0, value - 100) / 10
  );
  config.data.datasets[0].data = temperatureData.map((value) => value * 2);
  myChart.update();
  updateFileName();
}
// Funktion zum Laden der CSV-Datei und der Orte
function ladeOrte() {
  // Pfad zur CSV-Datei
  var csvDatei = "data/geodaten.csv";

  // XMLHttpRequest, um die CSV-Datei zu laden
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // CSV-Daten in einen Array von Zeilen aufteilen
      var zeilen = xhr.responseText.split("\n");

      // Extrahiere die Spaltenüberschriften (erste Zeile)
      var spalten = zeilen[0].split(";").map(function (spalte) {
        return spalte.trim();
      });

      // Iteriere durch die Zeilen und füge die Daten zum Array hinzu
      for (var i = 1; i < zeilen.length; i++) {
        var daten = zeilen[i].split(";");

        // Überprüfe, ob die Anzahl der Werte in der Zeile mit der Anzahl der Spaltenüberschriften übereinstimmt
        if (daten.length === spalten.length) {
          var datensatz = {};
          for (var j = 0; j < spalten.length; j++) {
            datensatz[spalten[j]] = daten[j].trim();
          }
          geodaten.push(datensatz);
        } else {
          console.error("Ungültige Zeile in CSV: ", zeilen[i]);
        }
      }

      // Sortiere das Array nach dem Land
      geodaten.sort(function (a, b) {
        var landA = a.Land.toUpperCase(); // Nicht case-sensitive sortieren
        var landB = b.Land.toUpperCase();
        if (landA < landB) {
          return -1;
        }
        if (landA > landB) {
          return 1;
        }
        return 0;
      });

      // Hier können Sie den Code für das Laden der Orte ins Dropdown-Menü implementieren
      var ortAuswahl = document.getElementById("ortAuswahl");

      // Füge die Optionen zum Dropdown-Menü hinzu
      for (var k = 0; k < geodaten.length; k++) {
        var option = document.createElement("option");
        option.value = geodaten[k].ID;
        option.text = geodaten[k].Land + " - " + geodaten[k].Ort;
        ortAuswahl.add(option);
      }
    }
  };
  xhr.open("GET", csvDatei, true);
  xhr.send();
}

// Lade die Orte beim Laden der Seite
window.onload = function () {
  ladeOrte();
};
