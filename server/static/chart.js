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
                label: "Temperature",
                lineTension: 0,
                backgroundColor: "transparent",
                borderColor: "#4cb5b5",
                borderWidth: 2,
                pointRadius: 0
            },
            {
                // y-dataset for day's maximum indoor temperature line,
                // shows a horizontal line at the max temperature
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
                ticks: {
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
                        // Strip down date from x-axis labels
                        return label.substring(11,16)
                    },
                }
            }],
        },
        legend: {
            display: false
        },
        hover: {
            mode: null
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
                    return this._data.labels[tooltipItem[0].index];
                },
                label: function(tooltipItems, data) {
                    let label = data.datasets[tooltipItems.datasetIndex].label;
                    if (label == "Temperature") {
                        // Only show current temperatures in tooltip
                        return label + ": " + tooltipItems.yLabel.toFixed(2) + "°C";
                    }
                }
            }
        }
    }
});


function getMinMaxTemp(arr) {
    return [
        parseFloat(Math.min.apply(Math, arr.map(function(el) { return el.temp; }))),
        parseFloat(Math.max.apply(Math, arr.map(function(el) { return el.temp; })))
    ];
}


// Function for getting new data and parsing it into the UI elements
function updateData() {
    // Define path to backend data entrypoint.
    var url = "temperature/read";

    // Make GET request to backend
    fetch(url).then(
        function(response) {
            response.json().then(function(data) {
                var iy = [], ix = [];

                // Place current, max and min temperatures into card views
                var peakValues = getMinMaxTemp(data);
                minTemperature.innerHTML = peakValues[0].toFixed(2);
                maxTemperature.innerHTML = peakValues[1].toFixed(2);
                currentTemperature.innerHTML = parseFloat(data[data.length - 1].temp).toFixed(2);

                // Parse fetched data into arrays
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(0);
                    date.setUTCSeconds(data[i].timestamp);
                    date = date.toISOString().replace("T", " ").substring(0, 16);
                    ix.push(date);
                    iy.push(parseFloat(data[i].temp).toFixed(2));
                }

                // Show the previous data fetch time in top bar
                updateTime.innerHTML = ix[ix.length - 1];

                // Place observed temperatures into the graph
                temps.data.labels = ix;
                temps.data.datasets[0].data = iy;

                // Create horizontal lines for max and min temperatures and draw them into the graph
                var maxSeriesIn = Array(data.length);
                var minSeriesIn = Array(data.length);
                temps.data.datasets[1].data = maxSeriesIn.fill(peakValues[1], 0, data.length);
                temps.data.datasets[2].data = minSeriesIn.fill(peakValues[0], 0, data.length);

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
    )
}


// Fetch new data every 10 seconds from the backend
updateData();
setInterval(updateData, 10000);
