var express = require('express');
var app = express();

var fs = require('fs');

// Set port
var port = process.env.PORT || 8888;

app.listen(port);
console.log("Listening on http://localhost:" + port + "...\n");
