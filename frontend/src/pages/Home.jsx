import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import banner from "../assets/banner.jpg";


export default function Home() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get("/categorias").then((res) => {
      setCategorias(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div 
        className="w-full h-64 bg-cover bg-center shadow-md"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold drop-shadow-lg">
            Marmitas frescas, feitas com carinho
          </h1>
        </div>
      </div>


      <div className="p-6">
        <h2 className="text-3xl font-bold text-green-700">Categorias</h2>
        <p className="text-gray-700 mt-1 mb-6">Escolha o tipo de prato:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {categorias.map((cat) => (
            <a 
              key={cat.id}
              href={`/categoria/${cat.id}`}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-green-700">{cat.nome}</h3>
              <p className="text-gray-500 mt-2">Clique para ver os itens →</p>
            </a>
          ))}

        </div>
      </div>
    </div>
  );
}
