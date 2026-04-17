import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute() {
  const { authReady, isAuthenticated } = useAuth();

  if (!authReady) {
    return <PageLoader label="Checking your session..." />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
