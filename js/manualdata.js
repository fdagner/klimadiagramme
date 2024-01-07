function updateChartData() {
  // Read temperature and precipitation from the input fields
  const temperatureInput = document.getElementById("temperatureInput").value;
  const precipitationInput =
    document.getElementById("precipitationInput").value;
  const ortInput = document.getElementById("ortInput").value;
  const hoeheInput = document.getElementById("hoeheInput").value;

  // Validation for location and altitude
  if (
    (ortInput.trim() !== "" &&
      !/^[a-zA-Z0-9\süöäßÜÖÄ.,'"`()/\-]*$/.test(ortInput)) ||
    ortInput.length > 30
  ) {
    alert(
      "Ungültiger Wert für Ort. Erlaubt sind nur Buchstaben, Zahlen und Leerzeichen. Nicht länger als 30 Zeichen."
    );
    return;
  }

  if (
    hoeheInput.trim() !== "" &&
    (!/^\d+$/.test(hoeheInput) || hoeheInput.length > 8)
  ) {
    alert(
      "Ungültiger Wert für Höhe. Erlaubt sind nur Zahlen. Nicht länger als 8 Zeichen."
    );
    return;
  }

  // Validation of user input
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
    .map((value) => parseFloat(value *2));
  const precipitationValues = precipitationInput
    .split(";")
    .map((value) => parseFloat(value));

  const chartPrecipitationData1 = precipitationValues.map((value) =>
    Math.min(value, 100)
  );
  const chartPrecipitationData2 = precipitationValues.map(
    (value) => Math.max(0, value - 100) / 10
  );

  // Transfer the new data to the diagram
  myChart.data.datasets[0].data = temperatureValues;
  myChart.data.datasets[3].data = temperatureValues;
  myChart.data.datasets[1].data = chartPrecipitationData1;
  myChart.data.datasets[2].data = chartPrecipitationData2;
  myChart.data.datasets[4].data = chartPrecipitationData1;
  myChart.data.datasets[5].data = chartPrecipitationData2;
  hoeheData = hoeheInput;
  ortData = ortInput;

  // Update the diagram with the new data
  myChart.update();

  // Calculate the new values for the average and the sum
  const temperatureSum = temperatureValues.reduce(
    (acc, temperature) => acc + temperature,
    0
  );
  const temperatureAverage = temperatureSum / temperatureData.length;
  const roundedAverageHalf = temperatureAverage / 2;
  const roundedAverage = parseFloat(roundedAverageHalf.toFixed(1));
  const precipitationSum = precipitationValues.reduce(
    (acc, precipitation) => acc + precipitation,
    0
  );
  const roundedPrecipitation = precipitationSum.toFixed(0);

  // Update the diagram captions and titles
  myChart.options.plugins.subtitle.text =
    "T: " +
    roundedAverage +
    "° C    N: " +
    roundedPrecipitation +
    " mm    " +
    hoeheData +
    " m. ü. NN";
  myChart.options.plugins.title.text = ortData;

  // Update the axis scaling
  myChart.options.scales.y1.max =
    100 + Math.ceil(Math.max(600, ...precipitationValues) / 100) * 10;
  myChart.options.scales.y1.min =
    -20 + Math.ceil(Math.min(-20, ...temperatureValues) / 2 / 10) * 2 * 10;
  myChart.options.scales.y2.max =
    100 + Math.ceil(Math.max(600, ...precipitationValues) / 100) * 10;
  myChart.options.scales.y2.min =
    -20 + Math.ceil(Math.min(-20, ...temperatureValues) / 2 / 10) * 2 * 10;


  // Hide the x-axis title
  myChart.options.scales.x.title.display = false;
  myChart.update();
}

function validateAndParseInput(inputString) {
  // Remove spaces
  const trimmedInput = inputString.replace(/\s/g, "");

  // Check whether it only contains numerical values (positive or negative)
  if (!/^(-?\d+(\.\d+)?;){11}-?\d+(\.\d+)?$/.test(trimmedInput)) {
    return null;
  }

  const values = trimmedInput
    .split(";")
    .map((value) => parseFloat(value.replace(",", ".")));

  // Check whether the number of values is 12
  if (values.length !== 12) {
    return null;
  }

  return values;
}
