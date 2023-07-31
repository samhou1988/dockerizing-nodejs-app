const express = require("express");
const redis = require("redis");
const app = express();
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});

function getIpv4() {
  "use strict";

  const { networkInterfaces } = require("os");

  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  return results["eth0"][0];
}
app.get("/", function (req, res) {
  redisClient.get("numVisits", function (err, numVisits) {
    numVisitsToDisplay = parseInt(numVisits) + 1;
    if (isNaN(numVisitsToDisplay)) {
      numVisitsToDisplay = 1;
    }
    res.send(`web1[${getIpv4()}]visits is: ${numVisitsToDisplay}`);
    numVisits++;
    redisClient.set("numVisits", numVisits);
  });
});

app.listen(5000, function () {
  console.log("Web application is listening on port 5000");
});
