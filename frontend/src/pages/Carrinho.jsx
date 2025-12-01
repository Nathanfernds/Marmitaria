import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Carrinho() {
  const { cart, increaseQty, decreaseQty, removeItem, total } = useCart();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>

        {cart.length === 0 ? (
          <p className="mt-4 text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <div className="mt-6 bg-white p-4 rounded shadow">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="font-bold text-xl">{item.nome}</h2>
                  <p className="text-gray-600">
                    R$ {Number(item.preco).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      className="px-3 py-1 bg-gray-300 rounded"
                      onClick={() => decreaseQty(item.id)}
                    >
                      -
                    </button>

                    <span className="font-bold">{item.qtd}</span>

                    <button
                      className="px-3 py-1 bg-gray-300 rounded"
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="text-red-600 font-semibold"
                  onClick={() => removeItem(item.id)}
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="text-right text-2xl font-bold mt-6">
              Total: R$ {total.toFixed(2)}
            </div>

            <a
              href="/checkout"
              className="bg-green-600 text-white px-6 py-3 rounded-lg mt-6 w-full text-lg hover:bg-green-700 block text-center"
            >
              Finalizar Pedido
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
