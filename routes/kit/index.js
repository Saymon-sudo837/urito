const express = require('express');
const database = require('../../database/mysql');
const routes = express.Router();

routes.get('/', async (req, res) => {
    res.render('kit/index');
})

routes.post('/andamento/:id', async (req, res) => {
    await database.andamento(req.params.id);
})

routes.post('/finalizar/:id', async (req, res) => {
    await database.finalizar(req.params.id);
})

module.exports = routes;