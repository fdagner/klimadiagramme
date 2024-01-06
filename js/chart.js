// Dummy data for precipitation per month and temperatures
const precipitationData = [
  110, 180, 120, 60, 10, 10, 10, 10, 60, 110, 130, 120,
];
const temperatureData = [-10, -5, -2, 4, 10, 15, 16, 15, 10, 5, 0, -5];

// Calculate the sum of the temperature data
const temperatureSum = temperatureData.reduce(
  (acc, temperature) => acc + temperature,
  0
);

// Calculate mean value
const temperatureAverage = temperatureSum / temperatureData.length;
const roundedAverage = parseFloat(temperatureAverage.toFixed(1));

// Calculate the sum of precipitation
const precipitationSum = precipitationData.reduce(
  (acc, precipitation) => acc + precipitation,
  0
);
const roundedPrecipitation = precipitationSum.toFixed(0);

// Function for adjusting the colour based on the precipitation value
function getColor(value) {
  return value <= 100 ? "#00B0F0" : "#40699C";
}
// Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
const plugin = {
  id: 'customCanvasBackgroundColor',
  options: {
    color: 'white', // Set the default color
  },
  beforeDraw: (myChart, args) => {
    const { ctx } = myChart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = plugin.options.color || '#99ffff';
    ctx.fillRect(0, 0, myChart.width, myChart.height);
    ctx.restore();
  }
};

const colorPicker = document.getElementById('colorPicker');

colorPicker.addEventListener('input', function () {
  plugin.options.color = this.value;
  myChart.update();
});

// Configuration for the diagram
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
        data: precipitationData.map((value) => Math.min(value, 100)), // Limit the value to 100
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
        data: precipitationData.map((value) => Math.max(0, value - 100) / 10), // Rest from 100
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
        data: precipitationData.map((value) => Math.min(value, 100)), // Limit the value to 100
        backgroundColor: "#00B0F0",
        stack: "stack1",
        yAxisID: "y1",
      },
      {
        label: "Pre2",
        type: "bar",
        hidden: false,
        data: precipitationData.map((value) => Math.max(0, value - 100) / 10), // Rest from 100
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
        customCanvasBackgroundColor: {
          color: 'white',
        },
        tooltip: {
        enabled: false,
      },
      subtitle: {
        padding: {
          bottom: 10,
        },
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
            size: 14,
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
        max: 100 + Math.ceil(Math.max(600, ...precipitationData) / 100) * 10,
        ticks: {
          stepSize: 20,
          color: "#00B0F0",
          font: {
            size: 14,
          },
          callback: function (value, index, values) {
            if (value > 100) {
              return 100 + (value - 100) * 10 + " mm";
            } else if (value < 0) {
              return "";
            } else {
              return value + " mm";
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
        max: 100 + Math.ceil(Math.max(600, ...precipitationData) / 100) * 10,
        ticks: {
          stepSize: 20,
          color: "#BE4B48",
          font: {
            size: 14,
          },
          beginAtZero: true,
          callback: function (value, index, values) {
            if (value < 81) {
              return value / 2 + "° C";
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
  plugins: [plugin],
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
    // Switch the hidden status first
    dataset.hidden = !dataset.hidden;

    // If the label is 'Pre1' or 'Pre2' and hidden=true, change the type to 'line', otherwise to 'bar'
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

// Create diagram
const ctx = document
  .getElementById("precipitationAndTemperatureChart")
  .getContext("2d");
myChart = new Chart(ctx, config);

function downloadChart() {
  // The diagram canvas element
  let canvas = document.getElementById("precipitationAndTemperatureChart");

  // Convert the canvas element into a Base64-encoded PNG URL
  let dataURL = canvas.toDataURL("image/png");

  // Create an invisible HTML link
  let downloadLink = document.createElement("a");
  downloadLink.href = dataURL;

  // Set the file name for the download
  let fileName = ortData.toLowerCase().replace(/\s/g, "_") + ".png";
  downloadLink.download = fileName;

  // Add the link to the document and simulate a click
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Remove the link from the document
  document.body.removeChild(downloadLink);
}
