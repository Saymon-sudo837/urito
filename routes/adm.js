const express = require('express');
const ipv4Http = require('../middleware/ipv4Http');
const key = require('../middleware/key');
const routes = express.Router();

routes.use('/', ipv4Http, key, require('./adm/home/index'));
routes.use('/estatisticas', ipv4Http, key, require('./adm/estatisticas/index'));
routes.use('/produto', ipv4Http, key, require('./adm/produtos/index'));
routes.use('/produto/editar', ipv4Http, key, require('./adm/produtos/configuracao'));

module.exports = routes;