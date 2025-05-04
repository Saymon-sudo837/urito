DROP DATABASE IF EXISTS urito;
CREATE DATABASE urito;
USE urito;
SET GLOBAL max_allowed_packet = 67108864;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    promo INTEGER NOT NULL,
    inPromo BOOLEAN NOT NULL DEFAULT false,
    mostrar BOOLEAN DEFAULT 1,
    ingredientes TEXT,
    imagem LONGTEXT
);

CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    preco DECIMAL(10,2) NOT NULL,
    andamento INT DEFAULT 0,
    nome TEXT NOT NULL,
    retirado BOOLEAN DEFAULT FALSE,
    observacao TEXT,
    data DATE DEFAULT CURRENT_DATE
);

CREATE TABLE produto_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idpedido INT NOT NULL,
    quantidade INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idpedido) REFERENCES pedido(id) ON DELETE CASCADE
);