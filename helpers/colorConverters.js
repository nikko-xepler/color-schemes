var cs = require('color-space');

function fillHex(string){
  for (var i=0; i<6; i++) {
    string = string.replace(string[i], string[i] + string[i]);
    i++;
  }
  return string;
}

function decimalToHex(decimal, digits) {
  digits = digits || 2;
  var h = decimal.toString(16);
  while (h.length < digits) {
    h = "0" + h;
  }
  return h
}

function rgbToHexColor(rgbColor) {
  var hexColor = [];
  for (var i=0; i<rgbColor.length; i++) {
    hexColor.push(decimalToHex(rgbColor[i]));
  }
  var string = '#' + hexColor.join('');
  return string;
}

function hexToRgbColor(hexColor) {
  var rgbColor = [];
  if (hexColor.length == 3) {
    hexColor = fillHex(hexColor);
  }
  for (var i=0; i<3; i++) {
    var val;
    var val = parseInt(hexColor[i] + hexColor[i+1], 16);
    rgbColor.push(val);
    i++;
  }
  return rgbColor;
}

var hex = {},
    rgb = cs.rgb,
    xyz = cs.xyz,
    lab = cs.lab,
    luv = cs.luv,
    lchuv = cs.lchuv;

hex.rgb = hexToRgbColor;

hex.lab = function(hexColor) {
  return xyz.lab(rgb.xyz(hexToRgbColor(hexColor)));
}

hex.luv = function(hexColor) {
  return xyz.luv(rgb.xyz(hexToRgbColor(hexColor)));
}

hex.lchuv = function(hexColor) {
  return xyz.lchuv(rgb.xyz(hexToRgbColor(hexColor)));
}

rgb.hex = rgbToHexColor;

lab.hex = function(labColor) {
  return rgb.hex(xyz.rgb(lab.xyz(labColor)))
}

luv.hex = function(luvColor) {
  return rgb.hex(xyz.rgb(luv.xyz(luvColor)))
}

lchuv.hex = function(lchuvColor) {
  return rgb.hex(xyz.rgb(lchuv.xyz(lchuvColor)))
}

module.exports = {
  hex: hex,
  rgb: rgb,
  lab: lab,
  luv: luv,
  lchuv: lchuv,
}
