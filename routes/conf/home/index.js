const express = require('express');
const ipv4 = require('../../../controller/ipv4');
const ips = require('../../../middleware/ips');
const routes = express.Router();

routes.get('/', async (req, res) => {
    const { whitelist, blacklist, pending } = await ips();
    res.render('./conf/home/index', {ipv4: ipv4(), whitelist: whitelist, blacklist: blacklist, pending: pending});
})

module.exports = routes;