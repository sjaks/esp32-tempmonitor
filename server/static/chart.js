/*
tempbodge: temp fetcher
sjaks@github.com
*/

// Handles to temperature DOM elements
var currentTemperature = document.getElementById("currentTemperature");
var maxTemperature = document.getElementById("maxTemperature");
var minTemperature = document.getElementById("minTemperature");
var updateTime = document.getElementById("updateTime");
var tempsChart = document.getElementById("temps");


// Handles to trend DOM elements
var trendUp = document.getElementById("trendUp");
var trendDown = document.getElementById("trendDown");


// Main temperature graph
var temps = new Chart(tempsChart, {
    type: "line",
    data: {
        labels: [], // x-axis labels
        datasets: [
            {
                // y-dataset for observed indoor temperatures
                label: "Indoors",
                data: [],
                lineTension: 0,
                backgroundColor: "transparent",
                borderColor: "#4cb5b5",
                borderWidth: 2,
                pointRadius: 0
            },
            {
                // y-dataset for day's maximum indoor temperature line,
                // shows a horizontal line at the max temperature
                label: "Indoors max",
                data: [],
                lineTension: 0,
                backgroundColor: "transparent",
                borderColor: "#e4629f",
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [2, 10]
            },
            {
                // y-dataset for day's minimum indoor temperature line,
                // shows a horizontal line at the min temperature
                label: "Indoors min",
                data: [],
                lineTension: 0,
                backgroundColor: "transparent",
                borderColor: "#59b0e4",
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [2, 10]
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                id: "Temperature",
                position: 'left',
                ticks: {
                    // Use some intuitive max and min
                    // values for the temperature y-axis
                    min: 14,
                    max: 34,
                    stepSize: 2
                }
            }],
            xAxes: [{
                ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                userCallback: function(label, index, labels) {
                    // Strip down x-axis labels
                    return label.substring(11,16)
                },
                }
            }],
        },
        legend: {
            display: false // legend not needed since there's just one relevant dataset
        },
        hover: {
            mode: null // disables on-hover datapoint highlight
        },
        tooltips: {
            yAlign: "top",
            mode: "x-axis", // always show tooltip on chart hover
            displayColors: false, // don't show line color square in tooltip
            caretSize: 0,
            backgroundColor: "#ffffff",
            titleFontColor: "#555b6e",
            bodyFontColor: "#555b6e",
            borderColor: "rgba(0,0,0,.125)",
            borderWidth: 1,
            callbacks: {
                title: function(tooltipItem){
                    // Show full datetime string in tooltip
                    return this._data.labels[tooltipItem[0].index].substring(0, 16);
                },
                label: function(tooltipItems, data) {
                    let label = data.datasets[tooltipItems.datasetIndex].label;
                    if (label == "Indoors") {
                        // Only show current temperatures in tooltip
                        return label + ": " + tooltipItems.yLabel.toFixed(2) + "°C";
                    }
                }
            }
        }
    }
});


// Function for getting new data and parsing it into the UI elements
function updateTimeateData() {
    // Define path to backend data entrypoint.
    var url = "temperature/read";


    // Make GET request to backend
    $.get(url, function(data) {
        var iy = [], ix = [];

        // Place current, max and min temperatures into card views
        currentTemperature.innerHTML = parseFloat(data[data.length - 1].temp).toFixed(2);
        maxTemperature.innerHTML = parseFloat(Math.max.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);
        minTemperature.innerHTML = parseFloat(Math.min.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);

        // Show the previous data fetch time in top bar
        updateTime.innerHTML = data[data.length - 1].timestamp;

        // Parse fetched data into arrays
        for (var i = 0; i < data.length; i++) {
            ix.push(data[i].timestamp);
            iy.push(parseFloat(data[i].temp).toFixed(2));
        }

        // Place observed temperatures into the graph
        temps.data.labels = ix;
        temps.data.datasets[0].data = iy;

        // Create horizontal lines for max and min temperatures and draw them into the graph
        var maxSeriesIn = Array(data.length);
        var minSeriesIn = Array(data.length);
        temps.data.datasets[1].data = maxSeriesIn.fill(maxTemperature.innerHTML, 0, data.length);
        temps.data.datasets[2].data = minSeriesIn.fill(minTemperature.innerHTML, 0, data.length);

        // Show temperature trend arrow based on temperature delta
        if (data[data.length - 1].temp >= data[data.length - 2].temp) {
            trendUp.style.display = "inline";
            trendDown.style.display = "none";
        } else {
            trendDown.style.display = "inline";
            trendUp.style.display = "none";
        }

        // Redraw the graph
        temps.update();
    });
}


// Function for zooming the graph
function changeScale(range) {
    console.log(range.value)
    temps.options.scales.yAxes[0].ticks.max = parseInt(range.value);
    temps.options.scales.yAxes[0].ticks.min = -2 * (parseInt(range.value) - 35);
    temps.updateTimeate();
}


// Fetch new data every 10 seconds from the backend
updateTimeateData();
setInterval(updateTimeateData, 10000);
