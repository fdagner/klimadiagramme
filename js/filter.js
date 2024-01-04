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

  const precipitationDataset = myChart.data.datasets[1];
  const precipitationDataset2 = myChart.data.datasets[2];

  if (isPrecipitationVisible) {
    precipitationDataset.hidden = false;
    precipitationDataset2.hidden = false;
  } else {
    precipitationDataset.hidden = true;
    precipitationDataset2.hidden = true;
  }
  myChart.update();
}

function toggleTemperatureVisibility() {
  const showTemperatureCheckbox = document.getElementById(
    "showTemperatureCheckbox"
  );
  const isTemperatureVisible = showTemperatureCheckbox.checked;

  const temperatureDataset = myChart.data.datasets[0];

  if (isTemperatureVisible) {
    temperatureDataset.hidden = false;
  } else {
    temperatureDataset.hidden = true;
  }
  myChart.update();
}
