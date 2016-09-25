var express = require('express');
var controller = require('./colors.controller')

var routes = express.Router();

routes.get('/', controller.index);
routes.post('/', controller.create);
routes.get('/:id', controller.show);

module.exports = routes;
