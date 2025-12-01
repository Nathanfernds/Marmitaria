import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useState } from "react";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [cliente, setCliente] = useState("");
  const [mesa, setMesa] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null); 

  async function enviarPedido() {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    if (!cliente || !mesa) {
      alert("Preencha seu nome e a mesa!");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/pedidos", {
        cliente,
        mesa,
        observacoes,
        itens: cart,
        total
      });

      setConfirmacao({
        id: res.data.pedido.id,
        status: res.data.pedido.status,
        total
      });

      clearCart();

    } catch (err) {
      console.error(err);
      alert("Erro ao enviar o pedido.");
    }

    setLoading(false);
  }

  if (confirmacao) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-10 text-center">
          <h1 className="text-3xl font-bold text-green-700">Pedido Enviado! 🎉</h1>

          <p className="text-gray-700 mt-4">
            Seu pedido foi registrado com sucesso.
          </p>

          <div className="mt-6 text-left bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-lg">
              <strong>Número do pedido:</strong> #{confirmacao.id}
            </p>
            <p className="text-lg mt-2">
              <strong>Status inicial:</strong> {confirmacao.status}
            </p>
            <p className="text-lg mt-2">
              <strong>Total:</strong> R$ {confirmacao.total.toFixed(2)}
            </p>
          </div>

          <a
            href="/"
            className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Revisar Pedido</h1>

        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Itens</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>{item.nome} (x{item.qtd})</span>
              <span>R$ {(item.preco * item.qtd).toFixed(2)}</span>
            </div>
          ))}

          <h2 className="text-2xl font-bold text-right mt-4">
            Total: R$ {total.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Informações</h2>

          <input
            type="text"
            placeholder="Seu nome"
            className="w-full border p-2 rounded mb-3"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mesa"
            className="w-full border p-2 rounded mb-3"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
          />

          <textarea
            placeholder="Observações (opcional)"
            className="w-full border p-2 rounded"
            rows="3"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={enviarPedido}
          disabled={loading}
          className="bg-green-600 w-full text-white py-3 rounded-lg text-lg shadow-md"
        >
          {loading ? "Enviando..." : "Enviar Pedido"}
        </button>
      </div>
    </div>
  );
}
