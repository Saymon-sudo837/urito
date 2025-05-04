const mysql = require('mysql2');
require('dotenv').config();
const colors = require('colors')

class Database {
    host
    user
    pass
    database
    connection
    constructor(host, user, pass, database) {
        this.host = host
        this.user = user
        this.pass = pass
        this.database = database
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: pass,
            database: database
        });
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Erro ao conectar:', err);
                return;
            }
            console.log('📕 | Conectado ao ' + 'MySql'.rainbow);
        });
    }

    newProduto(nome, preco, ingredientes, imagem) {
        preco = preco.toString().replace(",", "."); 
    
        this.connection.query(
            `INSERT INTO produtos (nome, preco, ingredientes, imagem) VALUES (?, ?, ?, ?)`,
            [nome, preco, ingredientes, imagem], 
            (err, result) => {
                if (err) {
                    console.error('Erro ao inserir:', err);
                    return;
                }
            }
        );
    }

    async produtos() {
        const produtos = await this.connection.promise().query('SELECT * FROM produtos');
        return produtos[0];
    }
    async produto(id) {
        const produto = await this.connection.promise().query('SELECT * FROM produtos WHERE id = ' + id);
        return produto[0][0];
    }
    async edit(id, nome, preco, ingredientes, imagem) {
        if(!imagem){
        return await this.connection.promise().query(
            `UPDATE produtos SET nome = ?, preco = ?, ingredientes = ? WHERE id = ?`,
            [nome, parseFloat(preco), ingredientes, id]
        );
        }
        await this.connection.promise().query(
            `UPDATE produtos SET nome = ?, preco = ?, ingredientes = ?, imagem = ? WHERE id = ?`,
            [nome, parseFloat(preco), ingredientes, imagem, id]
        );
    }
    async delete(id) {
        await this.connection.promise().query('DELETE FROM produtos WHERE id = ?', [id]);
    }
    async anotar(nome, pedido, observacao) {
        let total = 0;
        pedido.forEach(item => {
            total += (item.preco * item.quantidade) - (((item.promo / 100) * item.preco) * item.quantidade);
        });

        const connection = this.connection.promise();

        try {
            await connection.beginTransaction();

            const [resultPedido] = await this.connection.promise().query(
                'INSERT INTO pedido (preco, nome, andamento, observacao) VALUES (?, ?, ?, ?)',
                [total, nome, 0, observacao]
            );

            const pedidoId = resultPedido.insertId;

            for (const item of pedido) {
                await connection.query(
                    'INSERT INTO produto_pedido (idpedido, quantidade, nome, preco) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.quantidade, item.nome, item.preco]
                );
            }

            await connection.commit();
            return pedidoId;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    async andamento(id) {
        await this.connection.promise().query(
            `UPDATE pedido SET andamento = ? WHERE id = ?`,
            [1, id]
        );
    }

    async finalizar(id) {
        await this.connection.promise().query(
            `UPDATE pedido SET andamento = ? WHERE id = ?`,
            [2, id]
        );
    }

    async pedidos() {
        const [pedidos] = await this.connection.promise().query('SELECT * FROM pedido');
        const produtosEpedidos = [];
        for (const pedido of pedidos) {
            const [produtos] = await this.connection.promise().query('SELECT * FROM produto_pedido WHERE idpedido = ?', [pedido.id]);
            produtosEpedidos.push({ pedido, produtos });
        }
        return produtosEpedidos
    }

    async status() {
        const status = await this.connection.promise().query('SELECT * FROM pedido');
        return status[0];
    }

    async retirar(id) {
        await this.connection.promise().query(
            `UPDATE pedido SET retirado = ? WHERE id = ?`,
            [1, id]
        );
    }

    async Vsemanal() {
        const pedidos = await this.pedidos();
        const dia = new Date();
        const estatistica = [0, 0, 0, 0, 0, 0, 0]; 
        pedidos.forEach(pedido => {
            if(pedido.pedido.retirado != true){
                return;
            }
            if (pedido.pedido && pedido.pedido.data) {
                const dataPedido = new Date(pedido.pedido.data);
                if (validOthersCamps(dia, dataPedido)) {
                    if(dataPedido.getDate() == dia.getDate()){
                        estatistica[6]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 1)){
                        estatistica[5]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 2)){
                        estatistica[4]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 3)){
                        estatistica[3]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 4)){
                        estatistica[2]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 5)){
                        estatistica[1]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 6)){
                        estatistica[0]++;
                    }
                }
            }
        });
        function validOthersCamps(date1, date2) {
            return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
        }
        return estatistica;
    }

    async Vmensal() {
        const pedidos = await this.pedidos();
        const dia = new Date();
        const estatistica = new Array(31).fill(0);  
    
        pedidos.forEach(pedido => {
            if(pedido.pedido.retirado != true){
                return;
            }
            if (pedido.pedido && pedido.pedido.data) {
                const dataPedido = new Date(pedido.pedido.data);
                if (validOthersCamps(dia, dataPedido)) {
                    const diaDoPedido = dataPedido.getDate(); 
    
                    if (diaDoPedido == dia.getDate()) {
                        estatistica[30]++; 
                    } else if (diaDoPedido == (dia.getDate() - 1)) {
                        estatistica[29]++;  
                    } else if (diaDoPedido == (dia.getDate() - 2)) {
                        estatistica[28]++;  
                    } else if (diaDoPedido == (dia.getDate() - 3)) {
                        estatistica[27]++;
                    } else if (diaDoPedido == (dia.getDate() - 4)) {
                        estatistica[26]++;
                    } else if (diaDoPedido == (dia.getDate() - 5)) {
                        estatistica[25]++;
                    } else if (diaDoPedido == (dia.getDate() - 6)) {
                        estatistica[24]++;
                    } else if (diaDoPedido == (dia.getDate() - 7)) {
                        estatistica[23]++;
                    } else if (diaDoPedido == (dia.getDate() - 8)) {
                        estatistica[22]++;
                    } else if (diaDoPedido == (dia.getDate() - 9)) {
                        estatistica[21]++;
                    } else if (diaDoPedido == (dia.getDate() - 10)) {
                        estatistica[20]++;
                    } else if (diaDoPedido == (dia.getDate() - 11)) {
                        estatistica[19]++;
                    } else if (diaDoPedido == (dia.getDate() - 12)) {
                        estatistica[18]++;
                    } else if (diaDoPedido == (dia.getDate() - 13)) {
                        estatistica[17]++;
                    } else if (diaDoPedido == (dia.getDate() - 14)) {
                        estatistica[16]++;
                    } else if (diaDoPedido == (dia.getDate() - 15)) {
                        estatistica[15]++;
                    } else if (diaDoPedido == (dia.getDate() - 16)) {
                        estatistica[14]++;
                    } else if (diaDoPedido == (dia.getDate() - 17)) {
                        estatistica[13]++;
                    } else if (diaDoPedido == (dia.getDate() - 18)) {
                        estatistica[12]++;
                    } else if (diaDoPedido == (dia.getDate() - 19)) {
                        estatistica[11]++;
                    } else if (diaDoPedido == (dia.getDate() - 20)) {
                        estatistica[10]++;
                    } else if (diaDoPedido == (dia.getDate() - 21)) {
                        estatistica[9]++;
                    } else if (diaDoPedido == (dia.getDate() - 22)) {
                        estatistica[8]++;
                    } else if (diaDoPedido == (dia.getDate() - 23)) {
                        estatistica[7]++;
                    } else if (diaDoPedido == (dia.getDate() - 24)) {
                        estatistica[6]++;
                    } else if (diaDoPedido == (dia.getDate() - 25)) {
                        estatistica[5]++;
                    } else if (diaDoPedido == (dia.getDate() - 26)) {
                        estatistica[4]++;
                    } else if (diaDoPedido == (dia.getDate() - 27)) {
                        estatistica[3]++;
                    } else if (diaDoPedido == (dia.getDate() - 28)) {
                        estatistica[2]++;
                    } else if (diaDoPedido == (dia.getDate() - 29)) {
                        estatistica[1]++;
                    } else if (diaDoPedido == (dia.getDate() - 30)) {
                        estatistica[0]++;
                    }
                }
            }
        });
    
        function validOthersCamps(date1, date2) {
            return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear(); 
        }
        return estatistica;
    }
    
    async Lsemanal() {
        const pedidos = await this.pedidos();
        const dia = new Date();
        const estatistica = [0, 0, 0, 0, 0, 0, 0]; 
        pedidos.forEach(pedido => {
            if(pedido.pedido.retirado != true){
                return;
            }
            if (pedido.pedido && pedido.pedido.data) {
                const dataPedido = new Date(pedido.pedido.data);
                if (validOthersCamps(dia, dataPedido)) {
                    if(dataPedido.getDate() == dia.getDate()){
                        estatistica[6]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 1)){
                        estatistica[5]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 2)){
                        estatistica[4]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 3)){
                        estatistica[3]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 4)){
                        estatistica[2]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 5)){
                        estatistica[1]++;
                    }else if(dataPedido.getDate() == (dia.getDate() - 6)){
                        estatistica[0]++;
                    }
                }
            }
        });
        function validOthersCamps(date1, date2) {
            return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
        }
        return estatistica;
    }

    async Lmensal() {
        const pedidos = await this.pedidos();
        const dia = new Date();
        const estatistica = new Array(31).fill(0);  
    
        pedidos.forEach(pedido => {
            if(pedido.pedido.retirado != true){
                return;
            }
            if (pedido.pedido && pedido.pedido.data) {
                const dataPedido = new Date(pedido.pedido.data);
                if (validOthersCamps(dia, dataPedido)) {
                    const diaDoPedido = dataPedido.getDate(); 
    
                    if (diaDoPedido == dia.getDate()) {
                        estatistica[30]++; 
                    } else if (diaDoPedido == (dia.getDate() - 1)) {
                        estatistica[29]++;  
                    } else if (diaDoPedido == (dia.getDate() - 2)) {
                        estatistica[28]++;  
                    } else if (diaDoPedido == (dia.getDate() - 3)) {
                        estatistica[27]++;
                    } else if (diaDoPedido == (dia.getDate() - 4)) {
                        estatistica[26]++;
                    } else if (diaDoPedido == (dia.getDate() - 5)) {
                        estatistica[25]++;
                    } else if (diaDoPedido == (dia.getDate() - 6)) {
                        estatistica[24]++;
                    } else if (diaDoPedido == (dia.getDate() - 7)) {
                        estatistica[23]++;
                    } else if (diaDoPedido == (dia.getDate() - 8)) {
                        estatistica[22]++;
                    } else if (diaDoPedido == (dia.getDate() - 9)) {
                        estatistica[21]++;
                    } else if (diaDoPedido == (dia.getDate() - 10)) {
                        estatistica[20]++;
                    } else if (diaDoPedido == (dia.getDate() - 11)) {
                        estatistica[19]++;
                    } else if (diaDoPedido == (dia.getDate() - 12)) {
                        estatistica[18]++;
                    } else if (diaDoPedido == (dia.getDate() - 13)) {
                        estatistica[17]++;
                    } else if (diaDoPedido == (dia.getDate() - 14)) {
                        estatistica[16]++;
                    } else if (diaDoPedido == (dia.getDate() - 15)) {
                        estatistica[15]++;
                    } else if (diaDoPedido == (dia.getDate() - 16)) {
                        estatistica[14]++;
                    } else if (diaDoPedido == (dia.getDate() - 17)) {
                        estatistica[13]++;
                    } else if (diaDoPedido == (dia.getDate() - 18)) {
                        estatistica[12]++;
                    } else if (diaDoPedido == (dia.getDate() - 19)) {
                        estatistica[11]++;
                    } else if (diaDoPedido == (dia.getDate() - 20)) {
                        estatistica[10]++;
                    } else if (diaDoPedido == (dia.getDate() - 21)) {
                        estatistica[9]++;
                    } else if (diaDoPedido == (dia.getDate() - 22)) {
                        estatistica[8]++;
                    } else if (diaDoPedido == (dia.getDate() - 23)) {
                        estatistica[7]++;
                    } else if (diaDoPedido == (dia.getDate() - 24)) {
                        estatistica[6]++;
                    } else if (diaDoPedido == (dia.getDate() - 25)) {
                        estatistica[5]++;
                    } else if (diaDoPedido == (dia.getDate() - 26)) {
                        estatistica[4]++;
                    } else if (diaDoPedido == (dia.getDate() - 27)) {
                        estatistica[3]++;
                    } else if (diaDoPedido == (dia.getDate() - 28)) {
                        estatistica[2]++;
                    } else if (diaDoPedido == (dia.getDate() - 29)) {
                        estatistica[1]++;
                    } else if (diaDoPedido == (dia.getDate() - 30)) {
                        estatistica[0]++;
                    }
                }
            }
        });
    
        function validOthersCamps(date1, date2) {
            return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear(); 
        }
        return estatistica;
    }
    
    async promocao(id, promo){
        if(promo == 0){
            return await this.connection.promise().query(
                `UPDATE produtos SET promo = ?, inPromo = ? WHERE id = ?`,
                [0, 0, id]
            );
        }else{
            return await this.connection.promise().query(
                `UPDATE produtos SET promo = ?, inPromo = ? WHERE id = ?`,
                [promo, 1, id]
            );
        }
    }
    
    async toggleProduto(id) {
        id = Number(id);
        const [rows] = await this.connection.promise().query(
            `SELECT * FROM produtos WHERE id = ?`,
            [id]
        );
    
        const produto = rows[0];
        if (!produto) {
            return false;
        }
    
        const novoMostrar = produto.mostrar == 1 ? 0 : 1;
    
        await this.connection.promise().query(
            `UPDATE produtos SET mostrar = ? WHERE id = ?`,
            [novoMostrar, id]
        );
        return true;
    }

}


const database = new Database(process.env.host, process.env.user, process.env.pass, process.env.database);
module.exports = database;