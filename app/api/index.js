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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 *
 * @source http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 *
 * @source http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

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
              ha = rgbToHsl(a[0], a[1], a[2])[0];
              hb = rgbToHsl(b[0], b[1], b[2])[0];
              // Treat the lower hue as the "greater" item
              return 1 - ((ha < hb) * 2);
            })
            break;
          case "saturation":
            colors.sort(function(a, b) {
              sa = rgbToHsl(a[0], a[1], a[2])[1];
              sb = rgbToHsl(b[0], b[1], b[2])[1];
              // Treat the lower saturation as the "greater" item
              return 1 - ((sa < sb) * 2);
            })
            break;
          case "lightness":
            colors.sort(function(a, b) {
              la = rgbToHsl(a[0], a[1], a[2])[2];
              lb = rgbToHsl(b[0], b[1], b[2])[2];
              // Treat the higher lightness as the "greater" item
              return 1 - ((la > lb) * 2);
            })
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
