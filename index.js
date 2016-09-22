var express = require('express');
var app = express();

var fs = require('fs');

// Set port
var port = process.env.PORT || 8888;

var apiRoute = require('./app/api/index');

app.use('/api', apiRoute);

app.listen(port);
console.log("Listening on http://localhost:" + port + "...\n");
