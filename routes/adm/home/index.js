const express = require('express');
const routes = express.Router();

routes.get('/', async (req, res) => {
    res.render('./adm/home/index');
})

module.exports = routes;