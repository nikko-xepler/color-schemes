var express = require('express');
var controller = require('./schemes.controller')

var routes = express.Router();

routes.get('/', controller.index);
routes.post('/', controller.create);
routes.get('/count', controller.count);
routes.get('/:id', controller.show);

module.exports = routes;
