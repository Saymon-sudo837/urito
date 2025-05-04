const fs = require("fs").promises;
const path = require("path");
const { networkInterfaces } = require("os");

async function getIpv4(req, res, next) {
    let clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (clientIP.includes("::ffff:")) {
        clientIP = clientIP.split("::ffff:")[1];
    }

    try {
        const filePath = path.join(__dirname, "../permissions.json");

        const localIP = getLocalIP();

        if (clientIP === localIP) {
            return next();
        }

        const data = await fs.readFile(filePath, "utf-8");
        const permissions = JSON.parse(data);

        if (permissions.whitelist && permissions.whitelist.includes(clientIP)) {
            return next();  
        }

        if (permissions.blacklist && permissions.blacklist.includes(clientIP)) {
            return res.status(403).json({ message: "Pedido recusado: IP na blacklist" });
        }

        if (permissions.pending && permissions.pending.includes(clientIP)) {
            return res.status(400).json({ message: "Pedido pendente: IP já na lista de pendentes" });
        }

        permissions.pending = permissions.pending || [];
        permissions.pending.push(clientIP);

        await fs.writeFile(filePath, JSON.stringify(permissions, null, 2), "utf-8");

        return res.status(200).json({ message: "Pedido pendente: IP adicionado à lista de pendentes" });

    } catch (error) {
        console.error("Erro ao ler permissions.json:", error);
        return res.status(500).json({ message: "Erro ao verificar IP" });
    }
}

function getLocalIP() {
    const nets = networkInterfaces();
    let localIP = null;

    for (const net in nets) {
        for (const details of nets[net]) {
            if (details.family === 'IPv4' && !details.internal) {
                localIP = details.address;
                break;
            }
        }
    }

    return localIP;
}

module.exports = getIpv4;
