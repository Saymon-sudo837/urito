const database = require('../../database/mysql');

async function controller(req, res){
    res.redirect('/produto/editar');
    const { id } = req.params;
    database.delete(id);
}

module.exports = controller;