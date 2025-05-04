const path = require('path');
const fs = require('fs');

async function controller(req, res) {
    const { action, ip } = req.params;

    if (!["add", "remove", "revoke"].includes(action)) {
        return res.redirect('/');
    }

    try {
        const filePath = path.join(__dirname, "../permissions.json");

        const data = await fs.promises.readFile(filePath, "utf-8");
        const permissions = JSON.parse(data);

        let updated = false;

        if (!permissions.whitelist) permissions.whitelist = [];
        if (!permissions.blacklist) permissions.blacklist = [];
        if (!permissions.pending) permissions.pending = [];

        if (permissions.pending.includes(ip)) {
            permissions.pending = permissions.pending.filter(pendingIp => pendingIp !== ip);
            updated = true;
        }

        if (action === 'add') {
            if (!permissions.whitelist.includes(ip)) {
                permissions.whitelist.push(ip);
                updated = true;
            }
            permissions.blacklist = permissions.blacklist.filter(blacklistedIp => blacklistedIp !== ip);
        } else if (action === 'remove') {
            if (!permissions.blacklist.includes(ip)) {
                permissions.blacklist.push(ip);
                updated = true;
            }
            permissions.whitelist = permissions.whitelist.filter(whitelistedIp => whitelistedIp !== ip);
        } else if (action === 'revoke') {
            const whitelistBefore = permissions.whitelist.length;
            const blacklistBefore = permissions.blacklist.length;

            permissions.whitelist = permissions.whitelist.filter(whitelistedIp => whitelistedIp !== ip);
            permissions.blacklist = permissions.blacklist.filter(blacklistedIp => blacklistedIp !== ip);

            if (permissions.whitelist.length !== whitelistBefore || permissions.blacklist.length !== blacklistBefore) {
                updated = true;
            }
        }

        if (updated) {
            await fs.promises.writeFile(filePath, JSON.stringify(permissions, null, 2), "utf-8");
        }

        return res.redirect('/');
    } catch (error) {
        console.error("Erro ao ler permissions.json:", error);
        return res.status(500).json({ message: "Erro ao processar a requisição." });
    }
}

module.exports = controller;
