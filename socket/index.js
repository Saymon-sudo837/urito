const database = require("../database/mysql");

async function socket(io) {
  io.on("connection", (socket) => {
    socket.on("connection", async () => {
      const pedidos = await database.pedidos();
      const status = await database.status();
      socket.emit("pedidos", pedidos); 
      socket.emit("status", status); 
    });

    setInterval(async () => {
      const pedidos = await database.pedidos();
      const status = await database.status();
      io.emit("pedidos", pedidos); 
      io.emit("status", status); 
    }, 100); 
  });
}

module.exports = socket;
