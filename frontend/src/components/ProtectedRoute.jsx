import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { authReady, isAuthenticated, token } = useAuth();

  // Still loading auth state - show loader
  if (!authReady) {
    return <PageLoader label="Verifying access..." />;
  }

  // Auth state is ready but user is not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render the protected route
  return <Outlet />;
}
