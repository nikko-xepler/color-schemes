var validators = {};

function valueIsInRange(val, rangeStart, rangeEnd) {
  return val >= rangeStart && val <= rangeEnd;
}

validators.isValidHex = function(v) {
  v = v.toUpperCase();
  return v.length == 6 && /[0-9A-F]{6}/.test(v);
}

validators.isValidFloatArray = function(v) {
  if (v.length != 3) {
    return false;
  }

  for (i=0; i<3; i++) {
    if (!parseFloat(v[i])) {
      return false;
    }
  }

  return true;
}

validators.floatArrayError = function(key) {
  return "The value entered for \"" + key + "\" must be an array with exactly 3 floating-point decimals.";
}

validators.isValidL = function(value) {
  if (!valueIsInRange(value[0], 0, 100)) {
    return false;
  }
  return true;
}

validators.invalidLError = validators.floatArrayError("lab") + "\nThe first number in a \"lab\", \"luv\", or \"lchuv\" color must be between 0 and 100.";

validators.isValidIntArray = function(v) {
  if (v.length != 3) {
    return false;
  }

  for (i=0; i<3; i++) {
    if (!parseInt(v[i])) {
      return false;
    }
  }

  return true;
}

validators.intArrayError = function(key) {
  return "The value entered for \"" + key + "\" must be an array with exactly 3 integers.";
}

validators.isValidRgb = function(value) {
  for (var i=0; i<3; i++) {
    if (!valueIsInRange(value[i], 0, 255)) {
      return false;
    }
    return true;
  }
}

validators.invalidRgbError = validators.intArrayError("rgb") + "\nThe numbers in an \"rgb\" color must be between 0 and 255."

module.exports = validators;
