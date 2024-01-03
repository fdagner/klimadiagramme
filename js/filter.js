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
    myChart.options.plugins.title.text = ortData;
  } else {
    myChart.options.plugins.title.text = ""; // Leer, um den Text zu verbergen
  }

  myChart.update();
}
