const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com banco
const db = require("./config/db");

app.get("/", (req, res) => {
  res.send("API do Cardápio Digital está funcionando!");
});

// ROTAS NORMAIS
const categoriasRoutes = require("./routes/categorias");
app.use("/categorias", categoriasRoutes);

const itensRoutes = require("./routes/itens");
app.use("/itens", itensRoutes);

// LOGIN ADMIN (SEM AUTH)
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// AUTH MIDDLEWARE (somente para partes protegidas)
const auth = require("./middleware/auth");

// ROTAS DE PEDIDOS
const pedidosRoutes = require("./routes/pedidos");
app.use("/pedidos", pedidosRoutes);  // POST público
app.use("/admin/pedidos", auth, pedidosRoutes); // GET/PUT protegido

// ROTAS PROTEGIDAS PARA CRUD ITENS
app.use("/admin/itens", auth, itensRoutes);  // POST / PUT / DELETE

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
