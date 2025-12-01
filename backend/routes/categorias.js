const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LISTAR TODAS
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categorias ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar categorias" });
    }
});

// CRIAR
router.post("/", async (req, res) => {
    const { nome } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO categorias (nome) VALUES ($1) RETURNING *",
            [nome]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar categoria" });
    }
});

// DELETAR
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM categorias WHERE id = $1", [id]);
        res.json({ message: "Categoria removida" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao remover categoria" });
    }
});

module.exports = router;
