var Scheme = require('../../../models/scheme');
var Color = require('../../../models/color');
var getErrorMessages = require('../../../helpers/getErrorMessages');
var getColorParamsFrom = require('../../../helpers/getColorParamsFrom');

module.exports.index = function(req, res) {
  Scheme.find()
  .populate('colors')
  .then(function(results){
    return res.json(results);
  })
  .catch(function(err){
    console.log(err);
    return res.status(400).send("An error occurred.");
  });
}

module.exports.show = function(req, res) {
  Scheme.findOne({ _id: req.params.id })
  .populate('colors')
  .then(function(scheme){
    return res.json(scheme);
  })
  .catch(function(err){
    console.log(err);
    return res.status(404).send("No color scheme found.");
  });
}

module.exports.count = function(req, res) {
  Scheme.count()
  .then(function(number) {
    return res.json(number);
  })
  .catch(function(err) {
    return res.status(400).send("An error occurred.");
  })
}


function handleError(err, res) {
  if (err.errors) {
    console.log(err.errors);
    return res.status(400).json({ errors: getErrorMessages(err) });
  } else {
    return res.status(400).send("An error occurred.");
  }
}

module.exports.create = function(req, res) {
  var colors = req.body.colors;
  var colorsToCreate = [];
  for (var i=0; i<colors.length; i++) {
    if (colors[i].hasOwnProperty && colors[i].hasOwnProperty('hex')) {
      colors[i] = getColorParamsFrom("hex", colors[i].hex);
      colorsToCreate.push(colors.splice(i, 1)[0]);
      i--;
    }
  }
  console.log(colorsToCreate);
  if (colorsToCreate.length > 0) {
    Color.create(colorsToCreate)
    .then(function(createdColors) {
      createdColors.map(function(item){ colors.push(item._id) });
      console.log("finished creating colors:", createdColors);
      Scheme.create({
        colors: colors
      })
      .then(function(scheme){
        console.log("sending response...");
        return res.json(scheme);
      })
      .catch(function(err){
        return handleError(err, res);
      });
    })
    .catch(function(err){
      return handleError(err, res);
    });
  } else {
    Scheme.create({
      colors: colors
    })
    .then(function(scheme){
      console.log("sending response...");
      return res.json(scheme);
    })
    .catch(function(err){
      return handleError(err, res);
    });
  }
}
