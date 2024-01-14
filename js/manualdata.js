function updateChartData() {
  // Helper functions to get element values and display alerts
  const getValue = (id) => document.getElementById(id).value.trim();
  const showAlert = (message) => {
    alert(message);
    return;
  };

  // Retrieve location and altitude values from input fields
  const ortInput = getValue("ortInput");
  const hoeheInput = getValue("hoeheInput");

  // Validate location input
  if ((ortInput && !/^[a-zA-Z0-9\süöäßÜÖÄ.,'"`()/\-]*$/.test(ortInput)) || ortInput.length > 30) {
    return showAlert("Invalid value for location. Only letters, numbers, and spaces are allowed. Not longer than 30 characters.");
  }

  // Validate altitude input
  if (hoeheInput && (!/^\d+$/.test(hoeheInput) || hoeheInput.length > 8)) {
    return showAlert("Invalid value for altitude. Only numbers are allowed. Not longer than 8 characters.");
  }

  // Retrieve temperature and precipitation values from input fields
  const temperatureInput = getValue("temperatureInput");
  const precipitationInput = getValue("precipitationInput");

  // Function to validate and parse input strings
  const validateAndParseInput = (inputString) => {
    const trimmedInput = inputString.replace(/\s/g, "");
    return /^(-?\d+(\.\d+)?;){11}-?\d+(\.\d+)?$/.test(trimmedInput) ?
      trimmedInput.split(";").map((value) => parseFloat(value.replace(",", "."))) :
      null;
  };

  // Validate and parse temperature and precipitation inputs
  const validTemperatureValues = validateAndParseInput(temperatureInput);
  const validPrecipitationValues = validateAndParseInput(precipitationInput);

  // Check for invalid input or missing values
  if (!validTemperatureValues || !validPrecipitationValues) {
    return showAlert("Invalid or missing characters! Enter numerical data for all 12 months in both fields.");
  }

  // Process temperature and precipitation values
  const temperatureValues = validTemperatureValues.map((value) => value * 2);
  const precipitationValues = validPrecipitationValues;

  // Map precipitation data for chart
  const chartPrecipitationData1 = mapPrecipitationDataMin(precipitationValues);
  const chartPrecipitationData2 = mapPrecipitationDataMax(precipitationValues);

  // Update datasets in the chart
  myChart.data.datasets.forEach((dataset, index) => {
    if (index === 0 || index === 3) {
      dataset.data = temperatureValues;
    } else if (index === 1 || index === 4) {
      dataset.data = chartPrecipitationData1;
    } else if (index === 2 || index === 5) {
      dataset.data = chartPrecipitationData2;
    }
  });

  // Update location and altitude data
  hoeheData = hoeheInput;
  ortData = ortInput;

  // Update the chart
  myChart.update();

  // Calculate new values for average temperature and total precipitation
  const temperatureAverage = calculateAverage(temperatureValues);
  const roundedAverage = parseFloat((temperatureAverage / 2).toFixed(1));
  const precipitationSum = calculateSum(precipitationValues);
  const roundedPrecipitation = precipitationSum.toFixed(0);

  // Update chart subtitles and titles
  myChart.options.plugins.subtitle.text = `T: ${roundedAverage}° C    N: ${roundedPrecipitation} mm    ${hoeheData} m. ü. NN`;
  myChart.options.plugins.title.text = ortData;

  // Calculate scaling values for the y-axes
  const maxPrecipitation = Math.max(600, ...precipitationValues);
  const minTemperature = Math.min(-20, ...temperatureValues) / 2;

  // Update y-axis scaling in the chart options
  myChart.options.scales.y1.max = 100 + Math.ceil(maxPrecipitation / 100) * 10;
  myChart.options.scales.y1.min = -20 + Math.ceil(minTemperature / 10) * 2 * 10;
  myChart.options.scales.y2.max = 100 + Math.ceil(maxPrecipitation / 100) * 10;
  myChart.options.scales.y2.min = -20 + Math.ceil(minTemperature / 10) * 2 * 10;

  // Hide x-axis title
  myChart.options.scales.x.title.display = false;

  // Update the chart
  myChart.update();
}
