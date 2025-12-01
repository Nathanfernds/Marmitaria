import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminItens() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Formulário
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    descricao: "",
    imagem: "",
    preco: "",
    categoria_id: "",
  });

const token = localStorage.getItem("admintoken");

  // ==========================
  // Carregar itens e categorias
  // ==========================
  useEffect(() => {
    carregarItens();
    carregarCategorias();
  }, []);

  async function carregarItens() {
    const res = await api.get("/itens");
    setItens(res.data);
  }

  async function carregarCategorias() {
    const res = await api.get("/categorias");
    setCategorias(res.data);
  }

  // ==========================
  // Controle de Formulário
  // ==========================
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function novoItem() {
    setModoEdicao(false);
    setForm({
      id: null,
      nome: "",
      descricao: "",
      imagem: "",
      preco: "",
      categoria_id: "",
    });
  }

  // ==========================
  // Criar Item
  // ==========================
  async function criarItem() {
    try {
      await api.post("/itens", form, {
        headers: { Authorization: "Bearer " + token },
      });

      alert("Item criado com sucesso!");
      carregarItens();
      novoItem();

    } catch (err) {
      console.error(err);
      alert("Erro ao criar item");
    }
  }

  // ==========================
  // Editar Item
  // ==========================
  function selecionarItem(item) {
    setModoEdicao(true);
    setForm({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      imagem: item.imagem,
      preco: item.preco,
      categoria_id: item.categoria_id,
    });
  }

  async function salvarEdicao() {
    try {
      await api.put(`/itens/${form.id}`, form, {
        headers: { Authorization: "Bearer " + token },
      });

      alert("Item atualizado com sucesso!");
      carregarItens();
      novoItem();

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar item");
    }
  }

  // ==========================
  // Excluir item
  // ==========================
  async function excluirItem(id) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await api.delete(`/itens/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });

      alert("Item excluído!");
      carregarItens();

    } catch (err) {
      console.error(err);
      alert("Erro ao excluir item");
    }
  }

  // ==========================
  // RENDERIZAÇÃO
  // ==========================
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Itens</h1>

        {/* FORMULÁRIO */}
        <div className="bg-white p-6 shadow rounded-lg mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            {modoEdicao ? "Editar Item" : "Novo Item"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome do item"
              className="border p-2 rounded"
              value={form.nome}
              onChange={handleChange}
            />

            <input
              type="number"
              name="preco"
              placeholder="Preço"
              className="border p-2 rounded"
              value={form.preco}
              onChange={handleChange}
            />

            <input
              type="text"
              name="imagem"
              placeholder="URL da imagem"
              className="border p-2 rounded col-span-2"
              value={form.imagem}
              onChange={handleChange}
            />

            <select
              name="categoria_id"
              className="border p-2 rounded col-span-2"
              value={form.categoria_id}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <textarea
              name="descricao"
              placeholder="Descrição"
              className="border p-2 rounded col-span-2"
              rows={3}
              value={form.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4 flex gap-4">
            {!modoEdicao ? (
              <button
                onClick={criarItem}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Criar Item
              </button>
            ) : (
              <button
                onClick={salvarEdicao}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Salvar Edição
              </button>
            )}

            <button
              onClick={novoItem}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* LISTA DE ITENS */}
        <h2 className="text-2xl font-semibold mb-3">Itens Cadastrados</h2>

        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.nome}</td>
                <td className="p-3">R$ {item.preco}</td>
                <td className="p-3">{item.categoria}</td>
                <td className="p-3 flex gap-3 justify-center">

                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => selecionarItem(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => excluirItem(item.id)}
                  >
                    Remover
                  </button>

                </td>
              </tr>
            ))}

            {itens.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Nenhum item encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
