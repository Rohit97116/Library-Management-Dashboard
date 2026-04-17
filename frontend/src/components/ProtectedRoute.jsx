import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { authReady, isAuthenticated } = useAuth();

  if (!authReady) {
    return <PageLoader label="Restoring your workspace..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
