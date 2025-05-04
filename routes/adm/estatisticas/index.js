const express = require('express');
const database = require('../../../database/mysql');
const routes = express.Router();

routes.get('/vendas', async (req, res) => {
    const semanal = await database.Vsemanal();
    const mensal = await database.Vmensal();
    res.render('./adm/estatisticas/vendas', {semanal, mensal});
})

routes.get('/lucros', async (req, res) => {
    const semanal = await database.Lsemanal();
    const mensal = await database.Lmensal();
    res.render('./adm/estatisticas/lucros', {semanal, mensal});
})

module.exports = routes;