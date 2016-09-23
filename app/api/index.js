var express = require('express');
var fs = require('fs');
var path = require('path');
var palette = require('palette');
var Canvas = require('canvas');
var Image = Canvas.Image;

var rgb = require('color-space/rgb');
var hsl = require('color-space/hsl');
var lab = require('color-space/lab');
var xyz = require('color-space/xyz');
var luv = require('color-space/luv');
var lchuv = require('color-space/lchuv');

var DeltaE = require('delta-e');

var routes = express.Router();
var controller = {};

var images = fs.readdirSync('./examples');

function decimalToHex(decimal, digits) {
  digits = digits || 2;
  var h = decimal.toString(16);
  while (h.length < digits) {
    h = "0" + h;
  }
  return h
}

function hexToDecimal(hex) {
  return parseInt(hex, 16);
}

function rgbToHexColor(rgbColor) {
  var hexColor = [];
  for (var i=0; i<rgbColor.length; i++) {
    hexColor.push(decimalToHex(rgbColor[i]));
  }
  var string = '#' + hexColor.join('');
  return string;
}

// e.g. distanceFromColor([243, 123, 204], "red");
function distanceFromColor(rgbColor, color) {
  var colorIndexes = ["red", "green", "blue"];
  var i = colorIndexes.indexOf(color);
  var i_others = [0, 1, 2].filter(function(item) { return item != i });
  var dist1 = (rgbColor[i] - rgbColor[i_others[0]]);
  var dist2 = (rgbColor[i] - rgbColor[i_others[1]]);
  return dist1 + dist2;
}

function labArrayToObject(labColor) {
  var LABindexes = ["L", "A", "B"];
  var output = {};
  for (i=0; i<LABindexes.length; i++) {
    output[LABindexes[i]] = labColor[i];
  }
  return output;
}

function deltaDistanceFromColor(rgbColor, color) {
  var colorIndexes = ["red", "green", "blue"];
  var i = colorIndexes.indexOf(color);
  var maxColor = [255 * (i==0), 255 * (i==1), 255 * (i==2)];
  maxColor = labArrayToObject(xyz.lab(rgb.xyz(maxColor)));
  rgbColor = labArrayToObject(xyz.lab(rgb.xyz(rgbColor)));
  return DeltaE.getDeltaE00(rgbColor, maxColor);
}

// function distanceWithChroma(rgbColor, color) {
//   var dist = distanceFromColor(rgbColor, color);
//   var chroma = xyz.lchuv(rgb.xyz(rgbColor))[1];
//   return dist + chroma;
// }

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

      if (req.query.hasOwnProperty('picture')) {
        return res.sendFile(path.join(process.cwd(), 'examples', images[i]))
      }

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

      // Optionally sort
      if (req.query.hasOwnProperty('sortby')) {
        switch (req.query.sortby) {
          case "hue":
            colors.sort(function(a, b) {
              ha = xyz.lchuv(rgb.xyz(a))[2];
              hb = xyz.lchuv(rgb.xyz(b))[2];
              // Treat the lower hue as the "greater" item
              return 1 - ((ha < hb) * 2);
            })
            break;
          case "saturation":
            colors.sort(function(a, b) {
              sa = rgb.hsl(a)[1];
              sb = rgb.hsl(b)[1];
              // Treat the lower saturation as the "greater" item
              return 1 - ((sa < sb) * 2);
            })
            break;
          case "lightness":
            colors.sort(function(a, b) {
              la = xyz.lchuv(rgb.xyz(a))[0];
              lb = xyz.lchuv(rgb.xyz(b))[0];
              // Treat the higher lightness as the "greater" item
              return 1 - ((la > lb) * 2);
            })
            break;
          case "chroma":
            colors.sort(function(a, b) {
              la = xyz.lchuv(rgb.xyz(a))[1];
              lb = xyz.lchuv(rgb.xyz(b))[1];
              // Treat the lower chroma as the "greater" item
              return 1 - ((la < lb) * 2);
            })
            break;
          case "red":
          case "green":
          case "blue":
            colors.sort(function(a, b) {
              if (req.query.hasOwnProperty('deltae')) {
                return 1 - ((deltaDistanceFromColor(a, req.query.sortby) < deltaDistanceFromColor(b, req.query.sortby)) * 2);
              } else {
                return 1 - ((distanceFromColor(a, req.query.sortby) > distanceFromColor(b, req.query.sortby)) * 2);
              }
            });
            break;
          default:

        }
      }

      // Convert to hex colors
      var hexColors = [];
      for (var i=0; i<colors.length; i++) {
        var hex = rgbToHexColor(colors[i]);
        hexColors.push(hex);
      }
      // Remove duplicates
      hexColors = hexColors.filter(function(item, pos, arr) {
        return arr.indexOf(item) == pos;
      });

      if (req.query.hasOwnProperty('blocks')) {
        var blocks = [];
        for (var i=0; i<hexColors.length; i++) {

          var detailBlock = '';

          if (req.query.blocks == "detailed") {
            var xyzColor = rgb.xyz(colors[i]);
            var labColor = xyz.lab(xyzColor);
            var luvColor = xyz.luv(xyzColor);
            var lchuvColor = luv.lchuv(luvColor);
            detailBlock = '<div style="padding:5px 10px;">' +
              '<code>HEX: ' + hexColors[i] + '</code><br>' +
              '<code>RGB: [' + colors[i].join(', ') + ']</code><br>' +
              '<code>LAB: [' + labColor.join(', ') + ']</code><br>' +
              '<code>LUV: [' + luvColor.join(', ') + ']</code><br>' +
              '<code>LCH<sub>UV</sub>: [' + lchuvColor.join(', ') + ']</code>' +
            '</div>'
          }

          blocks.push('<div style="display:inline-block;width:' + (detailBlock ? 600 : 200) +
          'px;padding:2px;box-shadow:0 1px 4px rgba(0,0,0,0.2);margin-right:10px;margin-bottom:10px;">' +
            '<div style="height:200px;background:' + hexColors[i] + ';"></div>' +
            detailBlock +
          '</div>');
        }

        return res.send(blocks.join(' '));

      } else if (req.query.hasOwnProperty('gradient')) {
        var stops = [];

        for (var i=0; i<hexColors.length; i++) {
          stops.push(hexColors[i] + ' ' + ((i / (hexColors.length - 1)) * 100) + '%');
        }

        return res.send(
          '<body style="margin:0;">' +
            '<div style="height:100vh;width:100vw;margin:0;background:linear-gradient(to right, ' +
              stops.join(', ') +
            ');"></div>' +
          '</body>'
        );

      } else {
        return res.json(hexColors);
      }
    }
  }

  return res.status(400).send("Image not found.");
};

routes.get('/', controller.index);
routes.get('/:image', controller.image)

module.exports = routes;
