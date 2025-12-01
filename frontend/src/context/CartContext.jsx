import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("carrinho");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem("carrinho", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  function normalize(item) {
   
    const id = item.id ?? item.id_item ?? item._id ?? null;
    const preco = item.preco !== undefined ? Number(item.preco) : Number(item.price ?? 0);
    const nome = item.nome ?? item.name ?? "Item";
    const imagem = item.imagem ?? item.image ?? "";
    return { id, nome, preco, imagem };
  }

  function addItem(item) {
    const n = normalize(item);
    if (n.id == null) {
      console.warn("Item sem id não pode ser adicionado:", item);
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === n.id);
      if (exists) {
        return prev.map((i) =>
          i.id === n.id ? { ...i, qtd: i.qtd + 1 } : i
        );
      }
      return [...prev, { ...n, qtd: 1 }];
    });
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qtd: i.qtd + 1 } : i))
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qtd: Math.max(i.qtd - 1, 1) } : i
        )
        .filter((i) => i.qtd > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((acc, item) => acc + (Number(item.preco) || 0) * item.qtd, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, increaseQty, decreaseQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
