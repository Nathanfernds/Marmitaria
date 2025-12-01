import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("admintoken") || null);

  function login(tokenRecebido) {
    setToken(tokenRecebido);
    localStorage.setItem("admintoken", tokenRecebido);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("admintoken");
  }

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
