const fs = require("fs").promises;
const path = require("path");

async function getIpsFromPermissions() {
    try {
        const filePath = path.join(__dirname, "../permissions.json");
        const data = await fs.readFile(filePath, "utf-8");
        const permissions = JSON.parse(data);

        const whitelist = Array.isArray(permissions.whitelist) ? permissions.whitelist : Object.keys(permissions.whitelist || {});
        const blacklist = Array.isArray(permissions.blacklist) ? permissions.blacklist : Object.keys(permissions.blacklist || {});
        const pending = Array.isArray(permissions.pending) ? permissions.pending : Object.keys(permissions.pending || {});

        return { whitelist, blacklist, pending };
    } catch (error) {
        console.error("Erro ao ler permissions.json:", error);
        return { whitelist: [], blacklist: [], pending: [] }; 
    }
}

module.exports = getIpsFromPermissions;
