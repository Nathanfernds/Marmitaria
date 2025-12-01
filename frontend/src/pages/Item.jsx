import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Item() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    api.get("/itens/" + id).then((res) => {
      setItem(res.data);
    }).catch(err => {
      console.error("Erro ao buscar item:", err);
    });
  }, [id]);

  if (!item) {
    return <p className="p-6">Carregando...</p>;
  }

  // opcional: mostrar no console para debug
  console.log("Item carregado:", item);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <img
          src={item.imagem}
          alt={item.nome}
          className="w-full h-72 object-cover rounded-lg"
        />

        <h1 className="text-3xl font-bold mt-4">{item.nome}</h1>

        <p className="text-gray-700 mt-3">{item.descricao}</p>

        <p className="text-2xl font-bold text-green-600 mt-4">
          R$ {Number(item.preco).toFixed(2)}
        </p>

        <button
          onClick={() => addItem(item)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg mt-6 text-lg hover:bg-green-700"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
