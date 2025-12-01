import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { token, logout } = useAdminAuth();
  const { cart } = useCart();

  // quantidade total de itens no carrinho
  const totalQtd = cart.reduce((t, item) => t + item.qtd, 0);

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Dona do Sabor
      </Link>

      <div className="flex gap-6 text-lg items-center">
        
        <Link to="/" className="hover:text-amber-300 transition">
          Home
        </Link>

        {/* Carrinho com bolinha */}
        <Link to="/carrinho" className="relative hover:text-amber-300 transition">
          Carrinho

          {totalQtd > 0 && (
            <span className="absolute -top-3 -right-4 bg-amber-400 text-black rounded-full px-2 py-1 text-xs">
              {totalQtd}
            </span>
          )}
        </Link>

        {/* LOGIN ADMIN VISÍVEL SE NÃO ESTIVER LOGADO */}
        {!token && (
          <Link to="/admin" className="hover:text-amber-300 transition">
            Login Admin
          </Link>
        )}

        {/* MENU ADMIN VISÍVEL SOMENTE DEPOIS DO LOGIN */}
        {token && (
          <>
            <Link to="/admin/itens" className="hover:text-amber-300 transition">
              Itens
            </Link>

            <Link to="/admin/pedidos" className="hover:text-amber-300 transition">
              Pedidos
            </Link>

            <button
              onClick={logout}
              className="hover:text-red-300 transition"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
