import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute() {
  const { authReady, isAuthenticated, token } = useAuth();

  // Still loading auth state - show loader
  if (!authReady) {
    return <PageLoader label="Checking your session..." />;
  }

  // Auth state is ready and user is authenticated - redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated - render the guest route (login page)
  return <Outlet />;
}
