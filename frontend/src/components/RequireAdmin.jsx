import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function RequireAdmin({ children }) {
  const { token } = useAdminAuth();

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
