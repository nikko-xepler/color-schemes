var express = require('express');
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

var routes = express.Router();
var controller = {};

var images = fs.readdirSync('./examples');

controller.index = function(req, res) {
  res.send("Core api for color-schemes");
};

controller.image = function(req, res) {
  var imageName = req.params.image;
  console.log("checking for " + imageName + "...");
  for (var i=0; i<images.length; i++) {
    console.log("Does \"" + images[i] + "\" match (as \"" + images[i].split('.')[0] + "\")?");
    if (images[i].split('.')[0] == imageName) {
      // return res.sendFile(path.join(process.cwd(), 'examples', images[i]));

      var imgPath = path.join(process.cwd(), 'examples', images[i]);
      var img = fs.readFileSync(imgPath);

      res.send(new Buffer(img).toString('base64'));

      // return res.sendFile(path.join(process.cwd(), 'examples', images[i]));
    }
  }

  return res.status(400).send("Image not found.");
};

routes.get('/', controller.index);
routes.get('/:image', controller.image)

module.exports = routes;
