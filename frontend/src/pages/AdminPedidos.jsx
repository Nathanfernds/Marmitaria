import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  // Proteger rota: só entra se tiver token
  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      navigate("/admin"); // joga pro login
      return;
    }

    // Buscar pedidos
    api
      .get("/pedidos", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        // itens vem como JSON no banco → convertemos
        const pedidosFormatados = res.data.map((p) => ({
          ...p,
          itens: typeof p.itens === "string" ? JSON.parse(p.itens) : p.itens
        }));
        setPedidos(pedidosFormatados);
      })
      .catch((err) => {
        console.error("Erro ao carregar pedidos:", err);
      });
  }, [navigate]);

  // Função para atualizar o status
  async function atualizarStatus(id, novoStatus) {
    try {
      const token = localStorage.getItem("admintoken");

      await api.put(
        `/pedidos/${id}/status`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualizar na tela sem recarregar
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: novoStatus } : p
        )
      );
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Painel de Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-gray-600">Nenhum pedido encontrado.</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-bold">
                Pedido #{pedido.id} — {pedido.nome_cliente}
              </h2>
              <p className="text-gray-600">Mesa: {pedido.mesa}</p>

              {/* LISTA DE ITENS */}
              <div className="mt-2">
                <p className="font-semibold">Itens:</p>
                <ul className="list-disc ml-6">
                  {pedido.itens.map((item, i) => (
                    <li key={i}>
                      {item.nome} — {item.qtd}x (R$
                      {Number(item.preco).toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-green-700 font-bold mt-2">
                Total: R$ {Number(pedido.total).toFixed(2)}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                Criado em: {new Date(pedido.criado_em).toLocaleString()}
              </p>

              {/* ALTERAR STATUS */}
              <div className="mt-4">
                <label className="text-sm font-semibold">
                  Alterar Status:
                </label>

                <select
                  className="border p-2 ml-2 rounded"
                  value={pedido.status}
                  onChange={(e) =>
                    atualizarStatus(pedido.id, e.target.value)
                  }
                >
                  <option value="Recebido">Recebido</option>
                  <option value="Preparando">Preparando</option>
                  <option value="Pronto">Pronto</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
