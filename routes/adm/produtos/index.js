const multer = require('multer');
const database = require('../../../database/mysql');
const upload = multer({ storage: multer.memoryStorage() });
const express = require('express');
const routes = express.Router();

routes.get('/', async (req, res) => {
    res.render('./adm/produtos/index');
})

routes.post('/', upload.single("imagem"), require('../../../controller/produtos/new'));

routes.get('/promocao', async (req, res) => {
    const produtos = await database.produtos();
    res.render('./adm/produtos/promocao', {produtos: produtos});
})

routes.get('/promocao/add/:id', async (req, res) => {
    const produto = await database.produto(req.params.id);
    res.render('./adm/produtos/promocaoEdit', {produto: produto});
})

routes.post('/promocao/add/:id', upload.none(), async (req, res) => {
    const {promo} = await req.body;
    await database.promocao(req.params.id, promo);
    res.redirect('/produto/promocao');
})

module.exports = routes;