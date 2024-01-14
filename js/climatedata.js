let geodaten = [];
let ortData = "Musterhausen";
let hoeheData = "300";
let lonData = "0";
let latData = "0";
let roundedAverage;
let roundedPrecipitation;
let subtitleText = `T: ${roundedAverage}° C    N: ${roundedPrecipitation} mm    ${hoeheData} m. ü. NN`;

function calculateSum(data) {
    return data.reduce((acc, value) => acc + value, 0);
}

function calculateAverage(data) {
    const sum = calculateSum(data);
    return sum / data.length;
}

function mapPrecipitationDataMin(data) {
    return data.map((value) => Math.min(value, 100));
}

function mapPrecipitationDataMax(data) {
    return data.map((value) => Math.max(0, value - 100) / 10);
}

function updateFileName() {
    let cleanOrt = ortData.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s/g, "_");
    let fileName = cleanOrt + ".png";
    document.getElementById("downloadButton").download = fileName;
}

function anzeigenNachOrt() {
    let selectedOrtId = document.querySelector("#ortAuswahl a.selected").id;
    let datensatz = geodaten.find((datensatz) => datensatz.ID === selectedOrtId);

    if (datensatz) {
        let spalten = Object.keys(datensatz);
        ortData = datensatz["Ort"];
        hoeheData = datensatz["Hoehenlage"];
        lonData = datensatz["Laengengrad"];
        latData = datensatz["Breitengrad"];
        refData = datensatz["Referenzzeitraum"];

        for (let i = 16; i <= 27; i++) {
            let niederschlag = parseFloat(datensatz[spalten[i]].replace(",", "."));
            precipitationData[i - 16] = isNaN(niederschlag) ? null : niederschlag;
        }

        for (let j = 4; j <= 15; j++) {
            let temperatur = parseFloat(datensatz[spalten[j]].replace(",", "."));
            temperatureData[j - 4] = isNaN(temperatur) ? null : temperatur;
        }

        console.log("Niederschlagsdaten Array: ", precipitationData);
        console.log("Temperaturdaten Array: ", temperatureData);

        const temperatureAverage = calculateAverage(temperatureData);
        const roundedAverage = parseFloat(temperatureAverage.toFixed(1));
        const precipitationSum = calculateSum(precipitationData);
        const roundedPrecipitation = precipitationSum.toFixed(0);

        myChart.options.plugins.subtitle.text =
            `T: ${roundedAverage}° C    N: ${roundedPrecipitation} mm    ${hoeheData} m. ü. NN`;
        myChart.options.plugins.title.text = ortData;

        myChart.options.scales.y1.max = 100 + Math.ceil(Math.max(600, ...precipitationData) / 100) * 10;
        myChart.options.scales.y1.min = -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10;
        myChart.options.scales.y2.max = myChart.options.scales.y1.max;
        myChart.options.scales.y2.min = myChart.options.scales.y1.min;

        myChart.options.scales.x.title.display = true;
        updateChart();
        updateFileName();
        updateLeafletMap();
        setValuesInInputFields();
        setData();
    } else {
        console.error("Datensatz für ausgewählten Ort nicht gefunden.");
    }
}

function updateChart() {
    config.data.datasets[1].data = mapPrecipitationDataMin(precipitationData);
    config.data.datasets[2].data = mapPrecipitationDataMax(precipitationData);
    config.data.datasets[0].data = temperatureData.map((value) => value * 2);
    config.data.datasets[3].data = config.data.datasets[0].data;
    config.data.datasets[4].data = config.data.datasets[1].data;
    config.data.datasets[5].data = config.data.datasets[2].data;

    myChart.update();
    updateFileName();
}

function ladeOrte() {
    let csvDatei = "data/geodaten.csv";
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let zeilen = xhr.responseText.split("\n");
            let spalten = zeilen[0].split(";").map((spalte) => spalte.trim());

            for (let i = 1; i < zeilen.length; i++) {
                let daten = zeilen[i].split(";");

                if (daten.length === spalten.length) {
                    let datensatz = {};
                    for (let j = 0; j < spalten.length; j++) {
                        datensatz[spalten[j]] = daten[j].trim();
                    }
                    geodaten.push(datensatz);
                } else {
                    console.error("Ungültige Zeile in CSV: ", zeilen[i]);
                }
            }

            geodaten.sort((a, b) => {
                let landA = a.Land.toUpperCase();
                let landB = b.Land.toUpperCase();
                if (landA < landB) return -1;
                if (landA > landB) return 1;

                let ortA = a.Ort.toUpperCase();
                let ortB = b.Ort.toUpperCase();
                if (ortA < ortB) return -1;
                if (ortA > ortB) return 1;

                return 0;
            });

            var dropdownContent = document.getElementById("ortAuswahl");

            for (let k = 0; k < geodaten.length; k++) {
                let option = document.createElement("a");
                option.id = geodaten[k].ID;
                option.textContent = `${geodaten[k].Land} - ${geodaten[k].Ort} (${geodaten[k].Referenzzeitraum})`;
                dropdownContent.appendChild(option);

                option.addEventListener("click", function () {
                    toggleSelection(this);
                    anzeigenNachOrt();
                });
            }
        }
    };

    xhr.open("GET", csvDatei, true);
    xhr.send();
}

function setData() {
    document.getElementById("ortInput").value = ortData;
    document.getElementById("hoeheInput").value = hoeheData;
}

function setValuesInInputFields() {
    const temperatureString = temperatureData.join(";");
    const precipitationString = precipitationData.join(";");

    document.getElementById("temperatureInput").value = temperatureString;
    document.getElementById("precipitationInput").value = precipitationString;
}

document.addEventListener("DOMContentLoaded", function () {
    ladeOrte();
    setValuesInInputFields();
    setData();
});
