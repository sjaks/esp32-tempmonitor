/*
esp32-tempmonitor: temp fetcher
sjaks@github.com
*/

// Handle to DOM chart element
var tempsChart = document.getElementById("temps");

// Main temperature graph
var temps = new Chart(tempsChart, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                // y-dataset for observed indoor temperatures
                label: "Temperature",
                lineTension: 0,
                backgroundColor: "transparent",
                borderColor: "#10ab9c",
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
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    fontFamily: 'Rubik',
                    fontColor: '#b8b8b8'
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 20,
                    fontFamily: 'Rubik',
                    fontColor: '#b8b8b8',
                    userCallback: function(label) {
                        // Strip down date from x-axis labels
                        return label.split(" ")[1];
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
            mode: "x-axis",
            displayColors: false,
            caretSize: 0,
            titleFontFamily: 'Rubik',
            bodyFontFamily: 'Rubik',
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