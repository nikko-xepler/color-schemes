var express = require('express');
var app = express();

var assert = require('assert');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');

// Set port
var port = process.env.PORT || 8888;

// Configure mongoose promises to use bluebird
mongoose.Promise = bluebird;

// Connect to database
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost/colorschemes',
  { promiseLibrary: bluebird }
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error!'));
db.once('open', function() {
  console.log('Database connection established.');

  // var modelFolders = fs.readdirSync('./models');
  // var models = {};
  // for (var i=0; i<modelFolders.length; i++) {
  //   var modelName = modelFolders[i].replace('.js', '');
  //   models[modelName] = require('./models/' + modelName);
  // }
});

// User bodyParser to get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('strict routing', true);

// Set headers
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'GET', 'POST', 'PATCH', 'DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token, content-type, Authorization');
  next();
});

// Set API resource routes
var apiFolders = fs.readdirSync('./app/api');

for (var i=0;i<apiFolders.length;i++) {
  if (apiFolders[i].indexOf('.') == -1) {
    var resourceName = apiFolders[i];
    var resourceRoutes = require('./app/api/' + resourceName + "/index");
    console.log('Setting up routes for /api/' + resourceName + '...');
    app.use('/api/' + resourceName, resourceRoutes);
  }
}

var apiRoute = require('./app/api/index');

app.use('/api', apiRoute);

app.listen(port);
console.log("Listening on http://localhost:" + port + "...\n");
