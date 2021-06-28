// tempbodge
// sjaks@github.com

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, "../.env") })


// Define env vars
const secret = process.env.SECRET;
process.env.DEV == "true" ? urlPrefix = "temperature" : urlPrefix = "";


// Read static files into memory
var mainPageContent = fs.readFileSync(__dirname + "/static/index.html", { encoding: "utf8" });
var mainChartLogic = fs.readFileSync(__dirname + "/static/chart.js", { encoding: "utf8" });
var mainStyleSheet = fs.readFileSync(__dirname + "/static/style.css", { encoding: "utf8" });


const requestListener = function (req, res) {
    // Set default HTTP response values
    let header = "text/html; charset=utf-8";
    let returnCode = 200;
    let responseText = "";

    // Parse URL path and parameters
    const queryObject = url.parse(req.url, true);
    const path = queryObject.pathname.replace(/\//g, "");
    const querySecret = queryObject.query.secret;

    switch (path) {
        // Serve front-end interface
        case urlPrefix + "":
            responseText = mainPageContent;
            break;

        // Entrypoint for front-end to get latest data
        case urlPrefix + "read":
            data = fs.readFileSync(__dirname + "/db.json");
            header = "text/json";
            responseText = data;
            break;

        // Entrypoint for posting new temperature data from a client
        case urlPrefix + "post":
            // Require authentication and write given data
            if (querySecret === secret) {
                data = JSON.parse(fs.readFileSync(__dirname + "/temps"));
                if (data.length >= 289) {
                    // Pop the first element out (limit to 24h)
                    data.shift()
                }

                // Fill the payload with data
                data.push({
                    "timestamp": queryObject.query.timestamp,
                    "temp": queryObject.query.temp,
                    "outdoors": queryObject.query.outdoors
                });

                // Write new temp data to the back of the temp array file
                fs.writeFileSync(__dirname + "/temps", JSON.stringify(data));
                responseText = "success";
            } else {
                // Unauthorized access to post URL
                returnCode = 401;
                responseText = "failure";
            }
            break;

        // Return main chart
        case urlPrefix + "chart.js":
            responseText = mainChartLogic;
            break;

        // Return main styles
        case urlPrefix + "style.css":
            responseText = mainStyleSheet;
            break;

        // Requested URL not found
        default:
            returnCode = 404;
            responseText = "failure";
            break;
    }

    // Respond with a return code and possible data
    res.setHeader("Content-Type", header);
    res.writeHead(returnCode);
    res.end(responseText);
}


// Start the server
const server = http.createServer(requestListener);
server.listen(10990);
