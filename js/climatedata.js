let geodaten = []; // The array to store the CSV data
let myChart; // The chart object
let ortData = "Musterhausen";
let hoeheData = "300";
let lonData = "0";
let latData = "0";
// Function to update the file name based on the current location
function updateFileName()
{
    // Remove all dots and special characters from the location
    let cleanOrt = ortData
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s/g, "_");
    let fileName = cleanOrt + ".png";
    let downloadButton = document.getElementById("downloadButton");
    downloadButton.download = fileName;
}
// Function to display data after selecting the location
function anzeigenNachOrt()
{
    // Das erste ausgewählte Element abrufen
    let selectedOrtId = document.querySelector("#ortAuswahl a.selected").id;

    // Search the array for data for the selected location
    let datensatz = geodaten.find(function (datensatz)
    {
        return datensatz.ID === selectedOrtId;
    });

    // Check if the dataset was found
    if (datensatz)
    {
        // Extract column headers
        let spalten = Object.keys(datensatz);
        ortData = datensatz["Ort"];
        hoeheData = datensatz["Hoehenlage"];
        lonData = datensatz["Laengengrad"];
        latData = datensatz["Breitengrad"];
        refData = datensatz["Referenzzeitraum"];

        // Insert precipitation data into the precipitationData array
        for (let i = 16; i <= 27; i++)
        {
            let niederschlag = parseFloat(datensatz[spalten[i]].replace(",", "."));

            // Check for invalid values
            if (!isNaN(niederschlag))
            {
                precipitationData[i - 16] = niederschlag;
            }
            else
            {
                console.warn("Ungültiger Wert für Spalte " + (i + 1));
                precipitationData[i - 16] = null; // Add null or another value for invalid data
                updateFileName();
            }
        }

        // Extract temperature data and insert it into the temperatureData array
        for (let j = 4; j <= 15; j++)
        {
            let temperatur = parseFloat(datensatz[spalten[j]].replace(",", "."));

            // Check for invalid values
            if (!isNaN(temperatur))
            {
                temperatureData[j - 4] = temperatur;
            }
            else
            {
                console.warn("Ungültiger Wert für Temperatur in Spalte " + (j + 1));
                temperatureData[j - 4] = null; // Fügen Sie null oder einen anderen Wert für ungültige Daten hinzu
            }
        }

        // Extract temperature data and insert it into the temperatureData array
        console.log("Niederschlagsdaten Array: ", precipitationData);
        console.log("Temperaturdaten Array: ", temperatureData);
        const temperatureSum = temperatureData.reduce(
            (acc, temperature) => acc + temperature,
            0
        );

        const temperatureAverage = temperatureSum / temperatureData.length;
        const roundedAverage = parseFloat(temperatureAverage.toFixed(1));
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
            " m. ü. NN"),
        (myChart.options.plugins.title.text = ortData);

        (myChart.options.scales.y1.max =
            100 + Math.ceil(Math.max(600, ...precipitationData) / 100) * 10),
        (myChart.options.scales.y1.min = -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10),
        (myChart.options.scales.y2.max =
            100 + Math.ceil(Math.max(600, ...precipitationData) / 100) * 10),
        (myChart.options.scales.y2.min = -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10),
        // Update the chart with the new data
        (myChart.options.scales.x.title.display = true);
        updateChart();
        updateFileName();
        updateLeafletMap();
        setValuesInInputFields();
        setData();
    }
    else
    {
        console.error("Datensatz für ausgewählten Ort nicht gefunden.");
    }
}

// Function to load the CSV file and locations
function updateChart()
{
    config.data.datasets[1].data = precipitationData.map((value) =>
        Math.min(value, 100)
    );
    config.data.datasets[2].data = precipitationData.map(
        (value) => Math.max(0, value - 100) / 10
    );
    config.data.datasets[0].data = temperatureData.map((value) => value * 2);
    config.data.datasets[3].data = temperatureData.map((value) => value * 2);
    config.data.datasets[4].data = precipitationData.map((value) =>
        Math.min(value, 100)
    );
    config.data.datasets[5].data = precipitationData.map(
        (value) => Math.max(0, value - 100) / 10
    );

    myChart.update();
    updateFileName();
}

// Funktion zum Laden der CSV-Datei und der Orte
function ladeOrte()
{
    // Path to the CSV file
    let csvDatei = "data/geodaten.csv";

    // XMLHttpRequest to load the CSV file
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Split CSV data into an array of lines
            let zeilen = xhr.responseText.split("\n");

            // Extract column headers (first line)
            let spalten = zeilen[0].split(";").map(function (spalte)
            {
                return spalte.trim();
            });

            // Iterate through the lines and add data to the array
            for (let i = 1; i < zeilen.length; i++)
            {
                let daten = zeilen[i].split(";");

                // Check if the number of values in the line matches the number of column headers
                if (daten.length === spalten.length)
                {
                    let datensatz = {};
                    for (let j = 0; j < spalten.length; j++)
                    {
                        datensatz[spalten[j]] = daten[j].trim();
                    }
                    geodaten.push(datensatz);
                }
                else
                {
                    console.error("Ungültige Zeile in CSV: ", zeilen[i]);
                }
            }

            // Sort the array by country and then by location
            geodaten.sort(function (a, b)
            {
                let landA = a.Land.toUpperCase(); // Sort case-insensitively
                let landB = b.Land.toUpperCase();
                if (landA < landB)
                {
                    return -1;
                }
                if (landA > landB)
                {
                    return 1;
                }

                // If countries are the same, sort by location
                let ortA = a.Ort.toUpperCase();
                let ortB = b.Ort.toUpperCase();
                if (ortA < ortB)
                {
                    return -1;
                }
                if (ortA > ortB)
                {
                    return 1;
                }
                return 0;
            });

            // Implement code here for loading locations into the dropdown menu
            var dropdownContent = document.getElementById("ortAuswahl");

            for (let k = 0; k < geodaten.length; k++)
            {
                let option = document.createElement("a");
                option.id = geodaten[k].ID; // Setzen Sie die ID basierend auf der geodaten-ID
                option.textContent =
                    geodaten[k].Land +
                    " - " +
                    geodaten[k].Ort +
                    " (" +
                    geodaten[k].Referenzzeitraum +
                    ")";
                dropdownContent.appendChild(option);
                option.addEventListener("click", function ()
                {
                    toggleSelection(this);
                    anzeigenNachOrt();
                });
            }
        }
    };
    xhr.open("GET", csvDatei, true);
    xhr.send();
}

// Function to set example data in the input fields
function setData()
{
    document.getElementById("ortInput").value = ortData;
    document.getElementById("hoeheInput").value = hoeheData;
}

function setValuesInInputFields()
{
    // Convert temperatures to string with semicolon instead of comma
    const temperatureString = temperatureData.join(";");
    // Convert precipitation to string with semicolon instead of comma
    const precipitationString = precipitationData.join(";");

    // Set the values in the input fields
    document.getElementById("temperatureInput").value = temperatureString;
    document.getElementById("precipitationInput").value = precipitationString;
}

document.addEventListener("DOMContentLoaded", function ()
{
    ladeOrte();
    setValuesInInputFields();
    setData();
});
