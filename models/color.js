var mongoose = require('mongoose');
var validators = require('../helpers/validators');
var Schema = mongoose.Schema;

var colorSchema = new Schema({
  hex: {
    type: String,
    validate: {
      validator: validators.isValidHex,
      message: "The value entered for \"hex\" is not a valid sRGB hex value."
    },
  },
  rgb: {
    type: Array,
    validate: {
      validator: validators.isValidRgb,
      message: validators.invalidRgbError
    }
  },
  lab: {
    type: Array,
    validate: {
      validator: validators.isValidL,
      message: validators.invalidLError
    }
  },
  luv: {
    type: Array,
    validate: {
      validator: validators.isValidL,
      message: validators.invalidLError
    }
  },
  lchuv: {
    type: Array,
    validate: {
      validator: validators.isValidL,
      message: validators.invalidLError
    }
  },
}, {
  autoIndexId: true,
});

var Color = mongoose.model('Color', colorSchema);

module.exports = Color;
