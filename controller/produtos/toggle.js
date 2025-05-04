const database = require('../../database/mysql');

    async function controller(req, res){
        const { id } = req.params;
        await database.toggleProduto(id);
        res.redirect('/produto/editar');
    }

    module.exports = controller;