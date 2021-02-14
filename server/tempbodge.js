/*
      _       _        
 ___ (_) __ _| | _____  sjaks@github
/ __|| |/ _` | |/ / __| jaks.fi
\__ \| | (_| |   <\__ \ ------------
|___// |\__,_|_|\_\___/ tempbodge
   |__/                
BRIEF:
Tempbodge server implementation
*/

const http = require('http');
const url = require('url');
const fs = require('fs');
require('dotenv').config();

const secret = process.env.SECRET;

const requestListener = function (req, res) {
    // Set default HTTP response values
    let header = "text/html; charset=utf-8";
    let returnCode = 200;
    let responseText = "";

    // Parse URL path and parameters
    const queryObject = url.parse(req.url, true);
    const path = queryObject.pathname.replace(/\//g, "");
    const querySecret = queryObject.query.secret;

    if (path == "") {
        // Serve front-end interface
        responseText = fs.readFileSync(__dirname + "/index.html", { encoding: "utf8" });
    } else if (path == "read") {
        // Entrypoint for front-end to get latest data
        data = fs.readFileSync(__dirname + "/temps");
        header = "text/json";
        responseText = data;
    } else if (path == "post") {
        // Require authentication and write given data
        if (querySecret === secret) {
            data = JSON.parse(fs.readFileSync(__dirname + "/temps"));
            if (data.length >= 150) {
                // If the log is growing too large,
                // pop the first element first
                data.shift()
            }
            data.push({
                "timestamp": queryObject.query.timestamp,
                "temp": queryObject.query.temp
            });
            // Write new temp data to the back of the temp array file
            fs.writeFileSync(__dirname + "/temps", JSON.stringify(data));
            responseText = "success";
        } else {
            returnCode = 401;
            responseText = "failure";
        }
    } else {
        returnCode = 404;
        responseText = "failure";
    }

    // Respond
    res.setHeader("Content-Type", header);
    res.writeHead(returnCode);
    res.end(responseText);
}

const server = http.createServer(requestListener);
server.listen(10990);
