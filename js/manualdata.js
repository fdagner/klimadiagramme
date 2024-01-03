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

  // Aktualisieren Sie das Diagramm mit den neuen Daten
  myChart.update();

  // Berechnen Sie die neuen Werte für den Durchschnitt und die Summe
  const temperatureSum = temperatureValues.reduce((acc, temperature) => acc + temperature, 0);
  const temperatureAverage = temperatureSum / temperatureData.length;
  const roundedAverage = temperatureAverage.toFixed(1);
  const precipitationSum = precipitationValues.reduce((acc, precipitation) => acc + precipitation, 0);
  const roundedPrecipitation = precipitationSum.toFixed(0);

  // Aktualisieren Sie die Diagramm-Untertitel und -Titel
  myChart.options.plugins.subtitle.text =
    "T: " +
    roundedAverage/2 +
    "° C    N: " +
    roundedPrecipitation +
    " mm    " +
    hoeheData +
    "m. ü. NN";
  myChart.options.plugins.title.text = ortData;

  // Aktualisieren Sie die Achsenskalierungen
  myChart.options.scales.y1.max = 100 + Math.ceil(Math.max(700, ...precipitationValues) / 100) * 10;
  myChart.options.scales.y1.min = -20 + Math.ceil(Math.min(-20, ...temperatureValues) / 10) * 10;
  myChart.options.scales.y2.max = 100 + Math.ceil(Math.max(700, ...precipitationValues) / 100) * 10;
  myChart.options.scales.y2.min = -20 + Math.ceil(Math.min(-20, ...temperatureValues) / 10) * 10;

  // Aktualisieren Sie das Diagramm mit den neuen Achsenskalierungen
  myChart.update();


}


function validateAndParseInput(inputString) {
  // Entfernen von Leerzeichen
  const trimmedInput = inputString.replace(/\s/g, "");

// Überprüfen, ob es nur numerische Werte enthält (positive oder negative)
if (!/^(-?\d+(\.\d+)?;){11}-?\d+(\.\d+)?$/.test(trimmedInput)) {
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
