CREATE TABLE usuarios_admin (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE itens (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    imagem TEXT,
    preco NUMERIC(10,2) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    nome_cliente VARCHAR(100),
    mesa VARCHAR(20),
    itens JSON NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Recebido',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
