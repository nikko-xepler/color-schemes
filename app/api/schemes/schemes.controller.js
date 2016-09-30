var mongoose = require('mongoose');
var assert = require('assert');
var Scheme = require('../../../models/scheme').model;
var Promise = require('bluebird');
var getErrorMessages = require('../../../helpers/getErrorMessages');
var getColorParamsFrom = require('../../../helpers/getColorParamsFrom');

module.exports.index = function(req, res) {
  Scheme.find()
  .then(function(results){
    return res.json(results);
  })
  .catch(function(err){
    return handleError(err, res);
  });
}

module.exports.show = function(req, res) {
  Scheme.findOne({ _id: req.params.id })
  .populate('colors', 'hex rgb')
  .then(function(scheme){
    return res.json(scheme);
  })
  .catch(function(err){
    return handleError(err, res);
  });
}

module.exports.count = function(req, res) {
  Scheme.count()
  .then(function(number) {
    return res.json(number);
  })
  .catch(function(err) {
    return handleError(err, res);
  })
}


function handleError(err, res) {
  if (err.errors) {
    console.log(err.errors);
    return res.status(400).json({ errors: getErrorMessages(err) });
  } else {
    console.log(err);
    return res.status(400).send("An error occurred.");
  }
}

function updateColorParams(colors) {
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    if (color.hex) {
      colors[i] = getColorParamsFrom('hex', color.hex, color._id);
    } else {
      colors.splice(i, 1);
      i--;
    }
  }
  return colors
}

module.exports.create = function(req, res) {
  var obj = req.body;
  obj.colors = updateColorParams(obj.colors);
  // console.log(req.body.colors);
  Scheme.create(req.body)
  .then(function(result) {
    return res.json(result);
  })
  .catch(function(err) {
    return handleError(err, res);
  });
}

module.exports.update = function(req, res) {
  req.body.colors = updateColorParams(req.body.colors);
  var id = req.params.id || req.body.id;
  var obj = req.body;
  delete obj._id;
  Scheme.findOneAndUpdate(
    {_id: id},
    obj,
    { new: true }
  )
  .then(function(scheme) {
    return res.json(scheme);
  })
  .catch(function(err) {
    return handleError(err, res);
  });
}

module.exports.delete = function(req, res) {
  console.log(req.params.id);
  Scheme.findById(req.params.id)
  .then(function(scheme){
    console.log(scheme);
    return scheme.remove()
  })
  .then(function(){
    return res.send("Scheme removed.");
  })
  .catch(function(err){
    return handleError(err, res);
  });
}
