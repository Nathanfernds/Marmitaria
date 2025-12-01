import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/Home.jsx';
import Categoria from './pages/Categoria.jsx';
import Item from './pages/Item.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminPedidos from './pages/AdminPedidos.jsx';
import AdminItens from './pages/AdminItens.jsx';

import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import RequireAdmin from "./components/RequireAdmin";

import './index.css';

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/categoria/:id", element: <Categoria /> },
  { path: "/item/:id", element: <Item /> },
  { path: "/carrinho", element: <Carrinho /> },
  { path: "/checkout", element: <Checkout /> },

  // LOGIN ADMIN (público)
  { path: "/admin", element: <AdminLogin /> },

  // ROTAS PROTEGIDAS
  { 
    path: "/admin/pedidos",
    element: (
      <RequireAdmin>
        <AdminPedidos />
      </RequireAdmin>
    )
  },
  { 
    path: "/admin/itens",
    element: (
      <RequireAdmin>
        <AdminItens />
      </RequireAdmin>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AdminAuthProvider>
  </React.StrictMode>,
);
