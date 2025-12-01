const jwt = require("jsonwebtoken");
const SECRET = "meusegredo";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const parts = authHeader.split(" ");

  let token = authHeader;

  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    token = parts[1];
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Apenas administradores podem acessar" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("ERRO NO TOKEN:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = auth;
