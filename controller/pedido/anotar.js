const database = require('../../database/mysql');    

async function controller(req, res){
    const {pedido, nome, obs} = req.body;
    database.anotar(nome, pedido, obs);
    res.send({sucess: true});
}

module.exports = controller;