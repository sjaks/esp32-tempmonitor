/*
tempbodge: temp fetcher
sjaks@github.com
*/


// Handles to temperature DOM elements
var currentTemperature = document.getElementById("currentTemperature");
var maxTemperature = document.getElementById("maxTemperature");
var minTemperature = document.getElementById("minTemperature");
var updateTime = document.getElementById("updateTime");


// Handles to trend DOM elements
var trendUp = document.getElementById("trendUp");
var trendDown = document.getElementById("trendDown");


// Get min and max temperatures in a list [min, max]
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
                // Do not continue if there are no datapoints
                if (data.length < 1) {
                    return;
                }

                // Place current, max and min temperatures into card views
                var peakValues = getMinMaxTemp(data);
                minTemperature.innerHTML = peakValues[0].toFixed(2);
                maxTemperature.innerHTML = peakValues[1].toFixed(2);
                currentTemperature.innerHTML = parseFloat(data[data.length - 1].temp).toFixed(2);

                // Parse fetched data into arrays y and x
                var y = [], x = [];
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(0);
                    date.setUTCSeconds(data[i].timestamp);
                    date = date.toISOString().replace("T", " ").substring(0, 16);
                    x.push(date);
                    y.push(parseFloat(data[i].temp).toFixed(2));
                }

                // Show the previous data fetch time in top bar
                updateTime.innerHTML = x[x.length - 1];

                // Place observed temperatures into the graph
                temps.data.labels = x;
                temps.data.datasets[0].data = y;

                // Create horizontal lines for max and min temperatures and draw them into the graph
                temps.data.datasets[1].data = Array(data.length).fill(peakValues[1], 0, data.length);
                temps.data.datasets[2].data = Array(data.length).fill(peakValues[0], 0, data.length);

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
