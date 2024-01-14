// Function for filtering the options based on the search field
function myFunction()
{
    document.getElementById("ortAuswahl").classList.toggle("show");
}

function filterFunction()
{
    let input, filter, div, options, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("ortAuswahl");
    options = div.getElementsByTagName("a");

    for (i = 0; i < options.length; i++)
    {
        txtValue = options[i].textContent || options[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1)
        {
            options[i].style.display = "";
        }
        else
        {
            options[i].style.display = "none";
        }
    }
}

function toggleSelection(element)
{
    // Remove all other selected elements
    let allSelectedElements = document.querySelectorAll("#ortAuswahl a.selected");
    allSelectedElements.forEach(selectedElement =>
    {
        if (selectedElement !== element)
        {
            selectedElement.classList.remove("selected");
        }
    });

    // Add the "selected" class to the currently selected element
    element.classList.toggle("selected");
}

// Function for showing and hiding the location based on the checkbox status
function toggleOrtVisibility()
{
    const showOrtCheckbox = document.getElementById("showOrtCheckbox");
    const isOrtVisible = showOrtCheckbox.checked;

    if (isOrtVisible)
    {
        myChart.options.plugins.title.display = true;
    }
    else
    {
        myChart.options.plugins.title.display = false;
    }
    myChart.update();
}

function toggleSubtitleVisibility()
{
    const showSubtitleCheckbox = document.getElementById("showSubtitleCheckbox");
    const isSubtitleVisible = showSubtitleCheckbox.checked;

    if (isSubtitleVisible)
    {
        myChart.options.plugins.subtitle.display = true;
    }
    else
    {
        myChart.options.plugins.subtitle.display = false;
    }
    myChart.update();
}

function togglePrecipitationVisibility()
{
    const showPrecipitationCheckbox = document.getElementById(
        "showPrecipitationCheckbox"
    );
    const isPrecipitationVisible = showPrecipitationCheckbox.checked;

    const precipitationDataset1 = myChart.data.datasets[1];
    const precipitationDataset2 = myChart.data.datasets[2];
    const precipitationDataset3 = myChart.data.datasets[4];
    const precipitationDataset4 = myChart.data.datasets[5];

    if (isPrecipitationVisible)
    {
        precipitationDataset1.fill = {
            target: "-1",
            above: "rgba(0,176,240,0.75)",
        };
        precipitationDataset2.borderWidth = 3;
        precipitationDataset2.fill = {
            target: "-1",
            above: "rgba(64,105,156,0.75)",
        };
        precipitationDataset3.backgroundColor = "#00B0F0";
        precipitationDataset4.backgroundColor = "#40699C";
        myChart.options.scales.y1.display = true;
    }
    else
    {
        precipitationDataset1.fill = false;
        precipitationDataset2.borderWidth = 0;
        precipitationDataset2.fill = false;
        precipitationDataset3.backgroundColor = "transparent";
        precipitationDataset4.backgroundColor = "transparent";
        myChart.options.scales.y1.display = false;
    }
    myChart.update();
}

function toggleTemperatureVisibility()
{
    const showTemperatureCheckbox = document.getElementById(
        "showTemperatureCheckbox"
    );
    const isTemperatureVisible = showTemperatureCheckbox.checked;

    const temperatureDataset1 = myChart.data.datasets[0];
    const temperatureDataset2 = myChart.data.datasets[3];

    if (isTemperatureVisible)
    {
        temperatureDataset1.borderWidth = 3;
        temperatureDataset2.borderWidth = 3;
        temperatureDataset1.fill = {
            target: "1",
            above: "rgba(255, 252, 127, 0.75)",
        };
        myChart.options.scales.y2.display = true;
    }
    else
    {
        temperatureDataset1.borderWidth = 0;
        temperatureDataset2.borderWidth = 0;
        temperatureDataset1.fill = false;
        myChart.options.scales.y2.display = false;
    }
    myChart.update();
}
