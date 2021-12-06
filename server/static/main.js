/*
esp32-tempmonitor: temp fetcher
sjaks@github.com
*/

function updateIndoorTemps() {
    var currentTemperature = document.getElementById("current-indoors-temperature");
    var maxTemperature = document.getElementById("max-indoors-temperature");
    var minTemperature = document.getElementById("min-indoors-temperature");
    var updateTime = document.getElementById("update-time-indoors");

    // Define path to backend data entrypoint.
    var url = "/temps/indoors";

    // Make GET request to backend
    fetch(url).then(
        function(response) {
            response.json().then(function(data) {
                // Do not continue if there are no datapoints
                if (data.length < 1) {
                    return;
                }

                // Calculate min and max temps, place all temps into into card views
                let minValue = parseFloat(Math.min.apply(Math, data.map(function(el) { return el.temperature; }))).toFixed(2);
                let maxValue = parseFloat(Math.max.apply(Math, data.map(function(el) { return el.temperature; }))).toFixed(2);
                minTemperature.innerHTML = minValue;
                maxTemperature.innerHTML = maxValue;
                currentTemperature.innerHTML = parseFloat(data[data.length - 1].temperature).toFixed(2);

                // Parse fetched data into arrays y and x
                var y = [], x = [];
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].time * 1000);
                    date = date.toLocaleString('fi-FI').replace("klo ", "");
                    date = date.substring(0, date.length - 3); // splice seconds
                    x.push(date);
                    y.push(parseFloat(data[i].temperature).toFixed(2));
                }

                // Show the previous data fetch time
                updateTime.innerHTML = x[x.length - 1];

                // Place observed temperatures into the graph
                temps.data.labels = x;
                temps.data.datasets[0].data = y;

                // Create horizontal lines for max and min temperatures and draw them into the graph
                temps.data.datasets[1].data = Array(data.length).fill(minValue, 0, data.length);
                temps.data.datasets[2].data = Array(data.length).fill(maxValue, 0, data.length);

                // Set chart max and min
                temps.options.scales.yAxes[0].ticks.min = Math.round(parseFloat(minValue)) + 2;
                temps.options.scales.yAxes[0].ticks.max = Math.round(parseFloat(maxValue)) - 3;

                // Redraw the graph
                temps.update();
            });
        }
    )
}

function updateOutdoorTemps() {
    var currentTemperature = document.getElementById("current-outdoors-temperature");
    var updateTime = document.getElementById("update-time-outdoors");

    // Define path to backend data entrypoint.
    var url = "/temps/outdoors";

    // Make GET request to backend
    fetch(url).then(
        function(response) {
            response.json().then(function(data) {
                // Do not continue if there are no datapoints
                if (data.length < 1) {
                    return;
                }

                // Place temps into into card views
                currentTemperature.innerHTML = data['temperature'];

                // Show the previous data fetch time
                updateTime.innerHTML = data['time'];
            });
        }
    )
}

// Fetch new data every 10 seconds from the backend
updateIndoorTemps();
updateOutdoorTemps();
setInterval(updateIndoorTemps, 10000);
setInterval(updateOutdoorTemps, 10000);
