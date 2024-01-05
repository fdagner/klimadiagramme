// Funktion zum Filtern der Optionen basierend auf dem Suchfeld
function sucheOrt() {
  var input = document.getElementById("suchfeld").value.toLowerCase();
  var options = document.getElementById("ortAuswahl").options;

  var visibleOptionsCount = 0;

  for (var i = 0; i < options.length; i++) {
    var optionText = options[i].text.toLowerCase();
    var isVisible = optionText.includes(input);
    options[i].style.display = isVisible ? "block" : "none";

    if (isVisible) {
      visibleOptionsCount++;
    }
  }

  // Dynamisch die Größe des Dropdown-Menüs ändern
  var dropdown = document.getElementById("ortAuswahl");
  dropdown.size = Math.min(visibleOptionsCount, 5); // Hier können Sie die maximale Anzahl der sichtbaren Optionen anpassen (z. B. 10).

  // Zurücksetzen der Größe auf 1, wenn nur ein Ergebnis gefunden wurde
  if (visibleOptionsCount === 1) {
    dropdown.size = 2;
  }
}

// Funktion zum Ein- und Ausblenden des Orts basierend auf dem Checkbox-Status
function toggleOrtVisibility() {
  const showOrtCheckbox = document.getElementById("showOrtCheckbox");
  const isOrtVisible = showOrtCheckbox.checked;

  if (isOrtVisible) {
    myChart.options.plugins.title.display = true;
  } else {
    myChart.options.plugins.title.display = false;
  }

  myChart.update();
}

function toggleSubtitleVisibility() {
  const showSubtitleCheckbox = document.getElementById("showSubtitleCheckbox");
  const isSubtitleVisible = showSubtitleCheckbox.checked;

  if (isSubtitleVisible) {
    myChart.options.plugins.subtitle.display = true;
  } else {
    myChart.options.plugins.subtitle.display = false;
  }

  myChart.update();
}

function togglePrecipitationVisibility() {
  const showPrecipitationCheckbox = document.getElementById(
    "showPrecipitationCheckbox"
  );
  const isPrecipitationVisible = showPrecipitationCheckbox.checked;

  const precipitationDataset1 = myChart.data.datasets[1];
  const precipitationDataset2 = myChart.data.datasets[2];
  const precipitationDataset3 = myChart.data.datasets[4];
  const precipitationDataset4 = myChart.data.datasets[5];

  if (isPrecipitationVisible) {
    precipitationDataset1.fill = {
      target: "-1",
      above: "rgba(0,176,240,0.75)", // Area will be red above the origin
    };
    precipitationDataset2.borderWidth = 3;
    precipitationDataset2.fill = {
      target: "-1",
      above: "rgba(64,105,156,0.75)",
    };
    precipitationDataset3.backgroundColor = "#00B0F0";
    precipitationDataset4.backgroundColor = "#40699C";
  } else {
    precipitationDataset1.fill = false;
    precipitationDataset2.borderWidth = 0;
    precipitationDataset2.fill = false;
    precipitationDataset3.backgroundColor = "transparent";
    precipitationDataset4.backgroundColor = "transparent";
  }
  myChart.update();
}

function toggleTemperatureVisibility() {
  const showTemperatureCheckbox = document.getElementById(
    "showTemperatureCheckbox"
  );
  const isTemperatureVisible = showTemperatureCheckbox.checked;

  const temperatureDataset1 = myChart.data.datasets[0];
  const temperatureDataset2 = myChart.data.datasets[3];

  if (isTemperatureVisible) {
    temperatureDataset1.borderWidth = 3;
    temperatureDataset2.borderWidth = 3;
    temperatureDataset1.fill = {
      target: "1",
      above: "rgba(255, 252, 127, 0.75)", // Area will be red above the origin
    };
  } else {
    temperatureDataset1.borderWidth = 0;
    temperatureDataset2.borderWidth = 0;
    temperatureDataset1.fill = false;
  }
  myChart.update();
}
