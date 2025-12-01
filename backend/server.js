const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require("./config/db");

app.get("/", (req, res) => {
  res.send("API do Cardápio Digital está funcionando!");
});

const categoriasRoutes = require("./routes/categorias");
app.use("/categorias", categoriasRoutes);

const itensRoutes = require("./routes/itens");
app.use("/itens", itensRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const auth = require("./middleware/auth");

const pedidosRoutes = require("./routes/pedidos");
app.use("/pedidos", pedidosRoutes);  
app.use("/admin/pedidos", auth, pedidosRoutes); 

app.use("/admin/itens", auth, itensRoutes);  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
