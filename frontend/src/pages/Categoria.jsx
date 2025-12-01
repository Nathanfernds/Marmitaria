import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Categoria() {
  const { id } = useParams(); // pega o ID da categoria
  const [itens, setItens] = useState([]);
  const [categoriaNome, setCategoriaNome] = useState("");

  useEffect(() => {
    // Buscar itens
    api.get("/itens").then((res) => {
      const filtrados = res.data.filter((item) => item.categoria_id == id);
      setItens(filtrados);
    });

    // Buscar nome da categoria
    api.get("/categorias").then((res) => {
      const cat = res.data.find((c) => c.id == id);
      if (cat) setCategoriaNome(cat.nome);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">
          {categoriaNome || "Categoria"}
        </h1>

        {itens.length === 0 && (
          <p className="text-gray-600">Nenhum item cadastrado nesta categoria.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {itens.map((item) => (
            <div key={item.id} className="bg-white p-4 shadow rounded-lg">
              <img
                src={item.imagem}
                alt={item.nome}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-2">{item.nome}</h2>
              <p className="text-gray-600 text-sm">{item.descricao}</p>

              <p className="text-green-600 text-lg font-bold mt-2">
                R$ {Number(item.preco).toFixed(2)}
              </p>

              <a
                href={`/item/${item.id}`}
                className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded"
              >
                Ver detalhes
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
