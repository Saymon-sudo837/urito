const express = require('express');
const thisMachine = require('../middleware/thisMachine.js');
const routes = express.Router();

routes.use('/', thisMachine, require('./conf/home/index.js'))
routes.use('/ip', thisMachine, require('./conf/home/ips.js'))

module.exports = routes;