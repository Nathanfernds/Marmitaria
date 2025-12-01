const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const { cliente, mesa, observacoes, itens, total } = req.body;

    if (!cliente || !mesa || !itens || itens.length === 0) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const sql = `
      INSERT INTO pedidos (nome_cliente, mesa, itens, total, status)
      VALUES ($1, $2, $3, $4, 'Recebido')
      RETURNING *
    `;

    const result = await db.query(sql, [
      cliente,
      mesa,
      JSON.stringify(itens),
      total
    ]);

    res.json({
      message: "Pedido registrado com sucesso!",
      pedido: result.rows[0]
    });

  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pedidos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar pedidos:", err);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await db.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json({
      message: "Status atualizado com sucesso!",
      pedido: result.rows[0]
    });

  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

module.exports = router;
