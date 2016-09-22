var express = require('express');
var fs = require('fs');
var path = require('path');
var palette = require('palette');
var Canvas = require('canvas');
var Image = Canvas.Image;

var routes = express.Router();
var controller = {};

var images = fs.readdirSync('./examples');

controller.index = function(req, res) {
  res.send("Core api for color-schemes");
};

function rgbToHex(r, g, b) {
  var val = r << 16 | g << 8 | b;
  var string = '#' + val.toString('16');
  console.log(r, g, b, '=', string);
  return string;
}

controller.image = function(req, res) {
  var imageName = req.params.image;
  console.log("checking for " + imageName + "...");
  for (var i=0; i<images.length; i++) {
    console.log("Does \"" + images[i] + "\" match (as \"" + images[i].split('.')[0] + "\")?");
    if (images[i].split('.')[0] == imageName) {
      // return res.sendFile(path.join(process.cwd(), 'examples', images[i]));

      var canvas = new Canvas;
      var ctx = canvas.getContext('2d')
      var img = new Image;
      var imgPath = path.join(process.cwd(), 'examples', images[i]);
      img.src = imgPath;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      var quantity = parseInt(req.query.quantity) || 5;
      var colors = palette(canvas, quantity);
      var hexColors = [];
      for (var i=0; i<colors.length; i++) {
        var hex = rgbToHex(colors[i][0], colors[i][1], colors[i][2]);
        hexColors.push(hex);
      }

      if (req.query.hasOwnProperty('blocks')) {
        var blocks = [];
        for (var i=0; i<hexColors.length; i++) {
          blocks.push('<div style="display:inline-block;width:100px;height:100px;background:' + hexColors[i] + ';"></div>');
        }
        return res.send(blocks.join(' '))
      } else {
        return res.json(hexColors);
      }

      // var img = fs.readFileSync(imgPath);
      // res.send(new Buffer(img).toString('base64'));

      // return res.sendFile(path.join(process.cwd(), 'examples', images[i]));
    }
  }

  return res.status(400).send("Image not found.");
};

routes.get('/', controller.index);
routes.get('/:image', controller.image)

module.exports = routes;
