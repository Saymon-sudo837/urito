const database = require('../../database/mysql');
const multer = require("multer");

    async function controller(req, res){
        const {nome, preco, ingredientes} = req.body;
        if (!req.file) {
            req.flash('erro', `${nome} não foi adicionado, pois você não mandou uma imagem.`);
            return res.redirect('/produto');
        }
        const imagem64 = req.file.buffer.toString("base64");
        await database.newProduto(nome, preco, ingredientes, imagem64);

        req.flash('mensagem', `${nome} foi adicionado aos produtos.`);
        res.redirect('/produto');
    }

    module.exports = controller;