// Dummy-Daten für die Niederschläge pro Monat und Temperaturen
const precipitationData = [
  110, 180, 120, 60, 10, 10, 10, 10, 60, 110, 130, 120,
];
const temperatureData = [-10, -5, -2, 4, 10, 15, 16, 15, 10, 5, 0, -5];

// Summe der Temperaturdaten berechnen
const temperatureSum = temperatureData.reduce(
  (acc, temperature) => acc + temperature,
  0
);

// Mittelwert berechnen
const temperatureAverage = temperatureSum / temperatureData.length;
const roundedAverage = parseFloat(temperatureAverage.toFixed(1));

// Summe der Niederschläge berechnen
const precipitationSum = precipitationData.reduce(
  (acc, precipitation) => acc + precipitation,
  0
);
const roundedPrecipitation = precipitationSum.toFixed(0);

// Funktion zum Anpassen der Farbe basierend auf dem Niederschlagswert
function getColor(value) {
  return value <= 100 ? "#00B0F0" : "#40699C";
}

// Konfiguration für das Diagramm
const config = {
  data: {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: [
      {
        label: "Temperatur (°C)",
        data: temperatureData.map((value) => value * 2),
        type: "line",
        hidden: true,
        borderColor: "#BE4B48",
        lineTension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
        yAxisID: "y2",
        fill: {
          target: "1",
          above: "rgba(255, 252, 127, 0.75)", // Area will be red above the origin
        },
      },
      {
        label: "Niederschläge (mm)",
        type: "line",
        hidden: true,
        data: precipitationData.map((value) => Math.min(value, 100)), // Begrenze den Wert bis 100
        lineTension: 0,
        pointRadius: 0,
        borderWidth: 0,
        stack: "stack1",
        yAxisID: "y1",
        fill: {
          target: "-1",
          above: "rgba(0,176,240,0.75)",
        },
      },
      {
        label: "Niederschläge (mm)",
        type: "line",
        hidden: true,
        data: precipitationData.map((value) => Math.max(0, value - 100) / 10), // Rest ab 100
        lineTension: 0,
        pointRadius: 0,
        borderColor: "#40699C",
        borderWidth: 3,
        stack: "stack1",
        yAxisID: "y1",
        fill: {
          target: "-1",
          above: "rgba(64,105,156,0.75)",
        },
      },
      {
        label: "Temperatur (°C)",
        hidden: false,
        data: temperatureData.map((value) => value * 2),
        type: "line",
        borderColor: "#BE4B48",
        lineTension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        yAxisID: "y2",
      },
      {
        label: "Pre1",
        type: "bar",
        hidden: false,
        data: precipitationData.map((value) => Math.min(value, 100)), // Begrenze den Wert bis 100
        backgroundColor: "#00B0F0",
        stack: "stack1",
        yAxisID: "y1",
      },
      {
        label: "Pre2",
        type: "bar",
        hidden: false,
        data: precipitationData.map((value) => Math.max(0, value - 100) / 10), // Rest ab 100
        backgroundColor: "#40699C",
        stack: "stack1",
        yAxisID: "y1",
      },
    ],
  },
  options: {
    animation: {
      duration: 0,
    },
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      subtitle: {
        display: true,
        color: "gray",
        text:
          "T: " +
          roundedAverage +
          "° C " +
          "    N: " +
          roundedPrecipitation +
          " mm    " +
          hoeheData +
          " m. ü. NN",
        font: {
          size: 16,
          weight: "normal",
          family: "Arial",
          style: "normal",
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: ortData,
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 16,
          },
        },
        stacked: true,
        title: {
          display: true,
          text: "",
          align: "end",
          color: "grey",
          padding: {
            top: 10,
          },
          font: {
            size: 11,
            style: "italic",
          },
        },
      },
      y1: {
        beginAtZero: true,
        type: "linear",
        min: -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10,
        max: 100 + Math.ceil(Math.max(700, ...precipitationData) / 100) * 10,
        ticks: {
          color: "#00B0F0",
          font: {
            size: 16,
          },
          stepSize: 10,
          callback: function (value, index, values) {
            if (value > 100) {
              return 100 + (value - 100) * 10;
            } else if (value < 0) {
              return "";
            } else {
              return value;
            }
          },
        },
        position: "right",
        title: {
          display: false,
          text: "Niederschläge (mm)",
        },
      },
      y2: {
        type: "linear",
        position: "left",
        display: true,
        min: -20 + Math.ceil(Math.min(-10, ...temperatureData) / 10) * 2 * 10,
        max: 100 + Math.ceil(Math.max(700, ...precipitationData) / 100) * 10,
        ticks: {
          color: "#BE4B48",
          font: {
            size: 16,
          },
          beginAtZero: true,
          stepSize: 10,
          callback: function (value, index, values) {
            if (value < 81) {
              return value / 2;
            } else {
              return "";
            }
          },
        },
        title: {
          display: false,
          text: "Temperatur (°C)",
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  },
};

class Switch {
  constructor(domNode) {
    this.switchNode = domNode;
    this.switchNode.addEventListener("click", () => this.toggleStatus());
    this.switchNode.addEventListener("keydown", (event) =>
      this.handleKeydown(event)
    );
  }

  handleKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleStatus();
    }
  }

  // Switch state of a switch
  toggleStatus() {
    const currentState =
      this.switchNode.getAttribute("aria-checked") === "true";
    const newState = String(!currentState);

    this.switchNode.setAttribute("aria-checked", newState);
  }
}

// Initialize switches
window.addEventListener("load", function () {
  // Initialize the Switch component on all matching DOM nodes
  Array.from(document.querySelectorAll("[role^=switch]")).forEach(
    (element) => new Switch(element)
  );
});

function toggleData() {
  myChart.data.datasets.forEach((dataset) => {
    // Umschalten des hidden-Status zuerst
    dataset.hidden = !dataset.hidden;

    // Wenn das Label 'Pre1' oder 'Pre2' ist und hidden=true, ändere den Typ auf 'line', sonst auf 'bar'
    if (dataset.label === "Pre1" || dataset.label === "Pre2") {
      if (dataset.hidden) {
        dataset.type = "line";
        myChart.config.type = "line";
        myChart.options.scales.x.offset = false;
      } else {
        dataset.type = "bar";
        myChart.config.type = "bar";
        myChart.options.scales.x.offset = true;
      }
    }
  });
  myChart.update();
}

// Diagramm erstellen
const ctx = document
  .getElementById("precipitationAndTemperatureChart")
  .getContext("2d");
myChart = new Chart(ctx, config);

function downloadChart() {
  // Das Diagramm-Canvas-Element
  var canvas = document.getElementById("precipitationAndTemperatureChart");

  // Konvertiere das Canvas-Element in eine Base64-codierte PNG-URL
  var dataURL = canvas.toDataURL("image/png");

  // Erstelle einen unsichtbaren HTML-Link
  var downloadLink = document.createElement("a");
  downloadLink.href = dataURL;

  // Setze den Dateinamen für den Download
  var fileName = ortData.toLowerCase().replace(/\s/g, "_") + ".png";
  downloadLink.download = fileName;

  // Füge den Link zum Dokument hinzu und simuliere einen Klick
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Entferne den Link aus dem Dokument
  document.body.removeChild(downloadLink);
}
