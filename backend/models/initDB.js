const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const sql = fs.readFileSync(path.join(__dirname, "schema.sql")).toString();

pool.query(sql)
    .then(() => {
        console.log("Tabelas criadas com sucesso!");
        process.exit();
    })
    .catch(err => {
        console.error("Erro ao criar tabelas:", err);
        process.exit();
    });
