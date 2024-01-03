function updateChartData() {
  // Temperatur und Niederschlag aus den Input-Feldern lesen
  const temperatureInput = document.getElementById("temperatureInput").value;
  const precipitationInput =
    document.getElementById("precipitationInput").value;

  // Validierung der Benutzereingaben
  const validTemperatureValues = validateAndParseInput(temperatureInput);
  const validPrecipitationValues = validateAndParseInput(precipitationInput);

  if (!validTemperatureValues || !validPrecipitationValues) {
    alert(
      "Ungültige oder fehlende Zeichen! Geben Sie in beide Felder numerische Daten für alle 12 Monate ein."
    );
    return;
  }

  const temperatureValues = temperatureInput
    .split(";")
    .map((value) => parseFloat(value) * 2);
  const precipitationValues = precipitationInput
    .split(";")
    .map((value) => parseFloat(value));

  const chartPrecipitationData1 = precipitationValues.map((value) =>
    Math.min(value, 100)
  );
  const chartPrecipitationData2 = precipitationValues.map(
    (value) => Math.max(0, value - 100) / 10
  );

  // Übernehmen der neuen Daten in das Diagramm
  myChart.data.datasets[0].data = temperatureValues;
  myChart.data.datasets[1].data = chartPrecipitationData1;
  myChart.data.datasets[2].data = chartPrecipitationData2;

  // Aktualisierung des Diagramms
  myChart.update();
}

function validateAndParseInput(inputString) {
  // Entfernen von Leerzeichen
  const trimmedInput = inputString.replace(/\s/g, "");

  // Überprüfen, ob es nur numerische Werte enthält
  if (!/^\d+(\.\d+)?(;\d+(\.\d+)?){11}$/.test(trimmedInput)) {
    return null;
  }

  const values = trimmedInput
    .split(";")
    .map((value) => parseFloat(value.replace(",", ".")));

  // Überprüfen, ob die Anzahl der Werte 12 beträgt
  if (values.length !== 12) {
    return null;
  }

  return values;
}
