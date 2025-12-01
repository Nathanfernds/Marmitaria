const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",      
    password: "123",     
    database: "cardapio"
});

pool.connect()
    .then(() => console.log("PostgreSQL conectado com sucesso!"))
    .catch(err => console.error("Erro ao conectar no PostgreSQL:", err));

module.exports = pool;
