import { AnimatePresence } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";

function ProtectedRoute() {
  const { authReady, isAuthenticated } = useAuth();

  if (!authReady) {
    return <PageLoader label="Restoring your workspace..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const { authReady, isAuthenticated } = useAuth();

  if (!authReady) {
    return <PageLoader label="Checking your session..." />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomePage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
