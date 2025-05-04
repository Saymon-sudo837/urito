const express = require('express');
const controller = require('../../../controller/ipAccept');
const fs = require("fs").promises;
const path = require("path");
const routes = express.Router();

routes.get('/:action/:ip', controller);

module.exports = routes;
