const database = require('../../database/mysql');

async function controller(req, res){
    const {id} = req.params;
    const {nome, ingredientes, preco} = req.body;
    const imagem64 = req.file ? req.file.buffer.toString("base64") : false;
    database.edit(id, nome, preco, ingredientes, imagem64);
    res.redirect('/produto/editar');
}

module.exports = controller;