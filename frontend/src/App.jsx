import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import Galaxy from "./components/effects/Galaxy";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";

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
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <Galaxy
        mouseRepulsion={false}
        mouseInteraction={false}
        density={3}
        glowIntensity={0.3}
        saturation={0.2}
        hueShift={20}
        twinkleIntensity={1}
        rotationSpeed={0}
        repulsionStrength={0}
        autoCenterRepulsion={20}
        starSpeed={1.2}
        speed={1.9}
        className="pointer-events-none fixed inset-0 -z-10"
      />
      <AnimatedRoutes />
    </div>
  );
}
