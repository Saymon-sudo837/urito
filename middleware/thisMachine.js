const fs = require("fs").promises;
const getIpv4FromMachine = require('../controller/ipv4');  
const path = require("path");

async function getIpv4(req, res, next) {
    const allowedIP = await getIpv4FromMachine(req);

    let clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (clientIP === '::1' || clientIP === '127.0.0.1') {
        clientIP = allowedIP;
    }

    if (clientIP.includes("::ffff:")) {
        clientIP = clientIP.split("::ffff:")[1];
    }

    if (clientIP === allowedIP) {
        return next();  
    } else {
        return res.status(403).json({ message: "IP não autorizado" });
    }
}

module.exports = getIpv4;
