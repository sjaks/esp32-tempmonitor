// Handles to temperature DOM elements
var cur = document.getElementById("currTemp");
var mxt = document.getElementById("maxTemp");
var mnt = document.getElementById("minTemp");
var upd = document.getElementById("updateTime");
var ctx = document.getElementById("temps");


// Handles to trend DOM elements
var tru = document.getElementById("trendUp");
var trd = document.getElementById("trendDown");


// Main temperature graph
var temps = new Chart(ctx, {
type: "line",
data: {
    labels: [], // x-axis labels
    datasets: [
    {
        // y-dataset for observed temperatures
        label: "temps",
        data: [],
        lineTension: 0,
        backgroundColor: "transparent",
        borderColor: "#59cccc",
        borderWidth: 2,
        pointRadius: 0
    },
    {
        // y-dataset for day's maximum temperature line,
        // shows a horizontal line at the max temperature
        label: "maxline",
        data: [],
        lineTension: 0,
        backgroundColor: "transparent",
        borderColor: "#d90429",
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [2, 10]
    },
    {
        // y-dataset for day's minimum temperature line,
        // shows a horizontal line at the min temperature
        label: "minline",
        data: [],
        lineTension: 0,
        backgroundColor: "transparent",
        borderColor: "#4694f5",
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
        // Use some intuitive max and min
        // values for the temperature y-axis
        min: 14,
        max: 36,
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
    callbacks: {
        title: function(tooltipItem){
        // Show full datetime string in tooltip
        return this._data.labels[tooltipItem[0].index].substring(0, 16);
        },
        label: function(tooltipItems, data) {
        if (data.datasets[tooltipItems.datasetIndex].label == "temps") {
            // Only show current temperatures in tooltip
            return tooltipItems.yLabel.toFixed(2) + "°C";
        }
        }
    }
    }
}
});


// Function for getting new data and parsing it into the UI elements
function updateData() {
// Define path to backend data entrypoint.
var host = location.hostname;
var url;

if (host == "") {
    // Frontend accessed straight by opening the .html file,
    // get data from the main production site
    url = "https://jaks.fi/temperature/read";
} else if (host == "localhost" || host == "127.0.0.1") {
    // Frontend accessed via a local development env,
    // get data from the development backend
    url = "/read";
} else {
    // Otherwise, let the backend pass the desired hostname
    // for the frontend and fetch the data from there
    url = "_HOST_/read";
}


// Make GET request to backend
$.get(url, function(data) {
    var y = [], x = [];

    // Place current, max and min temperatures into card views
    cur.innerHTML = parseFloat(data[data.length - 1].temp).toFixed(2);
    mxt.innerHTML = parseFloat(Math.max.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);
    mnt.innerHTML = parseFloat(Math.min.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);

    // Show the previous data fetch time in top bar
    upd.innerHTML = data[data.length - 1].timestamp;

    // Parse fetched data into arrays
    for (var i = 0; i < data.length; i++) {
    x.push(data[i].timestamp);
    y.push(parseFloat(data[i].temp).toFixed(2));
    }

    // Place observed temperatures into the graph
    temps.data.labels = x;
    temps.data.datasets[0].data = y;

    // Create horizontal lines for max and min temperatures and draw them into the graph
    var maxSeries = Array(data.length);
    var minSeries = Array(data.length);
    temps.data.datasets[1].data = maxSeries.fill(mxt.innerHTML, 0, data.length);
    temps.data.datasets[2].data = minSeries.fill(mnt.innerHTML, 0, data.length);

    // Show temperature trend arrow based on temperature delta
    if (data[data.length - 1].temp >= data[data.length - 2].temp) {
    tru.style.display = "inline";
    trd.style.display = "none";
    } else {
    trd.style.display = "inline";
    tru.style.display = "none";
    }

    // Redraw the graph
    temps.update();
});
}


// Fetch new data every 10 seconds from the backend
updateData();
setInterval(updateData, 10000);