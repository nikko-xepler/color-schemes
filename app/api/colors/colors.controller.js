var Color = require('../../../models/color').model;
var getErrorMessages = require('../../../helpers/getErrorMessages');
var getColorParamsFrom = require('../../../helpers/getColorParamsFrom');

module.exports.index = function(req, res) {
  Color.find()
  .select('hex rgb')
  .then(function(results) {
    return res.json(results);
  })
  .catch(function(err) {
    console.log(err);
    return res.status(400).send("An error occurred.");
  });
}

module.exports.show = function(req, res) {
  Color.findById(req.params.id)
  .then(function(color) {
    return res.json(color);
  })
  .catch(function(err) {
    console.log(err);
    return res.status(404).send("Color not found.");
  });
}

module.exports.count = function(req, res) {
  Color.count()
  .then(function(number) {
    return res.json(number);
  })
  .catch(function(err) {
    return res.status(400).send("An error occurred.");
  })
}

var colorSpaces = ["Hex", "RGB", "LAB", "LUV", "LCHUV"];

module.exports.create = function(req, res) {
  var output = getColorParamsFrom("hex", req.body.hex);
  Color.create({
    hex: output.hex,
    rgb: output.rgb,
    lab: output.lab,
    luv: output.luv,
    lchuv: output.lchuv,
  })
  .then(function(color){
    return res.json(color);
  })
  .catch(function(err){
    if (err.errors) {
      // console.log(output);
      console.log(err.errors);
      return res.status(400).json({ errors: getErrorMessages(err) });
    } else {
      return res.status(400).send("An error occurred.");
    }
  })
}

// module.exports.createFromHex = function(req, res) {
//   var params = getColorParamsFrom("hex", req.body.hex);
//   return createColorFromParams(params, req, res);
// }
//
// module.exports.createFromRGB = function(req, res) {
//   var params = getColorParamsFrom("rgb", req.body.rgb);
//   return createColorFromParams(params, req, res);
// }
//
// module.exports.createFromLAB = function(req, res) {
//   var params = getColorParamsFrom("lab", req.body.rgb);
//   return createColorFromParams(params, req, res);
// }

// function createColorFromParams(colorParams, req, res) {
//   Color.create(colorParams)
//   .then(function(color) {
//     return res.json(color);
//   })
//   .catch(function(err) {
//     console.log(err);
//     if (err.errors) {
//       return res.status(400).json({ errors: getErrorMessages(err) });
//     } else {
//       return res.status(400).send("An error occurred.");
//     }
//   });
// }

module.exports.update = function(req, res) {
  var output = getColorParamsFrom("hex", req.body.hex);
  Color.findAndUpdate(req.params.id, output)
  .then(function(color){
    return res.json(color);
  })
  .catch(function(err){
    if (err.errors) {
      // console.log(output);
      console.log(err.errors);
      return res.status(400).json({ errors: getErrorMessages(err) });
    } else {
      return res.status(400).send("An error occurred.");
    }
  });
}

module.exports.delete = function(req, res) {
  Color.findById(req.params.id)
  .then(function(color){
    color.remove()
    .then(function(){
      return res.send("Color removed.");
    })
    .catch(function(err){
      if (err.errors) {
        // console.log(output);
        console.log(err.errors);
        return res.status(400).json({ errors: getErrorMessages(err) });
      } else {
        return res.status(400).send("An error occurred.");
      }
    })
  })
  .catch(function(err){
    return res.status(404).send("Color not found");
  })
}
