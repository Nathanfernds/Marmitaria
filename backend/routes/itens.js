const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth"); // 🔐 Proteção para admin

router.get("/", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT itens.*, categorias.nome AS categoria
            FROM itens
            LEFT JOIN categorias ON itens.categoria_id = categorias.id
            ORDER BY itens.id
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao listar itens:", err);
        res.status(500).json({ error: "Erro ao listar itens" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT itens.*, categorias.nome AS categoria
            FROM itens
            LEFT JOIN categorias ON itens.categoria_id = categorias.id
            WHERE itens.id = $1
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Item não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao buscar item:", err);
        res.status(500).json({ error: "Erro ao buscar item" });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { nome, descricao, imagem, preco, categoria_id } = req.body;

        if (!nome || !preco || !categoria_id) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        const sql = `
            INSERT INTO itens (nome, descricao, imagem, preco, categoria_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const result = await db.query(sql, [
            nome,
            descricao || "",
            imagem || "",
            preco,
            categoria_id
        ]);

        res.json({
            message: "Item criado com sucesso!",
            item: result.rows[0]
        });

    } catch (err) {
        console.error("Erro ao criar item:", err);
        res.status(500).json({ error: "Erro ao criar item" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { nome, descricao, imagem, preco, categoria_id } = req.body;
        const { id } = req.params;

        const result = await db.query(
            `
            UPDATE itens
            SET nome = $1, descricao = $2, imagem = $3, preco = $4, categoria_id = $5
            WHERE id = $6
            RETURNING *
            `,
            [nome, descricao, imagem, preco, categoria_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Item não encontrado" });
        }

        res.json({
            message: "Item atualizado com sucesso!",
            item: result.rows[0]
        });

    } catch (err) {
        console.error("Erro ao atualizar item:", err);
        res.status(500).json({ error: "Erro ao atualizar item" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query("DELETE FROM itens WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Item não encontrado" });
        }

        res.json({ message: "Item removido com sucesso!" });

    } catch (err) {
        console.error("Erro ao deletar item:", err);
        res.status(500).json({ error: "Erro ao remover item" });
    }
});

module.exports = router;
