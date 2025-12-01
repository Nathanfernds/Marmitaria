const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = "meusegredo";

router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await db.query(
            "SELECT * FROM usuarios_admin WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }

        const admin = result.rows[0];

        const senhaConfere = await bcrypt.compare(senha, admin.senha);

        if (!senhaConfere) {
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                isAdmin: true
            },
            SECRET,
            { expiresIn: "4h" }
        );

        res.json({ token });

    } catch (err) {
        console.error("ERRO NO LOGIN:", err);
        res.status(500).json({ error: "Erro no login" });
    }
});

module.exports = router;
