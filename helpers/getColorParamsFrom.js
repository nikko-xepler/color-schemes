var converters = require('./colorConverters');

function setAllFromHex(hexColor) {
  var output = {};
  output.hex = hexColor;
  output.rgb = converters.hex.rgb(hexColor);
  output.lab = converters.hex.lab(hexColor);
  output.luv = converters.hex.luv(hexColor);
  output.lchuv = converters.hex.lchuv(hexColor);
  return output;
}

module.exports = function(key, value) {
  var params = {};
  var hex;
  console.log(key, value);
  switch (key) {
    case "hex":
      hex = value;
      break;
    case "rgb":
      hex = rgbToHexColor(value);
      break;
    case "lab":
      hex = converters.lab.hex(value);
      break;
    case "luv":
      hex = converters.luv.hex(value);
      break;
    case "lchuv":
      hex = converters.lchuv.hex(value);
      break;
    default:
  }

  params = setAllFromHex(hex);
  return params;
}
