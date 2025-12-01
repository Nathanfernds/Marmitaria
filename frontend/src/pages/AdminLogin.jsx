import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();
  const { login } = useAdminAuth(); // <<< IMPORTANTE

  async function handleLogin(e) {
    e.preventDefault(); // <<< evita recarregar página

    try {
      const res = await api.post("/admin/login", { email, senha });

      // Salvar no Context e no localStorage
      login(res.data.token);

      navigate("/admin/pedidos");
    } catch (err) {
      setErro("Email ou senha incorretos");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <form
        onSubmit={handleLogin}
        className="p-6 max-w-md mx-auto bg-white shadow p-6 rounded"
      >
        <h1 className="text-3xl font-bold mb-4">Login do Administrador</h1>

        {erro && <p className="text-red-600 mb-3">{erro}</p>}

        <input
          type="text"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded mb-3"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 w-full text-white py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
