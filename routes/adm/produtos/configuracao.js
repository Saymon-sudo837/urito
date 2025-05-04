const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const database = require('../../../database/mysql');
const routes = express.Router();

routes.get('/', async (req, res) => {
    const produtos = await database.produtos();
    res.render('./adm/produtos/configuracao', {produtos: produtos});
})

routes.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const produto = await database.produto(id);
    res.render('./adm/produtos/configuracaoEditar', {produto: produto});
})

routes.get('/toggle/:id', require('../../../controller/produtos/toggle'));

routes.get('/deletar/:id', require('../../../controller/produtos/deletar'));

routes.post('/:id', upload.single("imagem"), require('../../../controller/produtos/editar'));

module.exports = routes;