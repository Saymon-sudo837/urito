const os = require("os");

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const interfaceName in interfaces) {
        for (const net of interfaces[interfaceName]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "IP não encontrado";
}
module.exports = getLocalIP;