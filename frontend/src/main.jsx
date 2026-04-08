import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className:
                "border border-slate-200 bg-white text-slate-900 shadow-soft dark:border-white/10 dark:bg-slate-900 dark:text-slate-50",
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
