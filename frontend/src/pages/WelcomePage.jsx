import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  FileSpreadsheet,
  Landmark,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    icon: Landmark,
    title: "Welcome to Ambey Library",
    text: "Smart Library Management System",
  },
  {
    icon: WalletCards,
    title: "Monthly fee clarity",
    text: "Every payment stays easy to read.",
  },
  {
    icon: FileSpreadsheet,
    title: "Live logbook",
    text: "March to February at a glance.",
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <motion.main
      className="min-h-screen px-4 py-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-lg border border-white/40 bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950">
              <BookOpenText size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                Ambey Library
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Library Management System
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="glass-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            Welcome
          </p>
          <motion.h1
            className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl dark:text-white"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.28 }}
          >
            Welcome to Ambey Library
          </motion.h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Smart Library Management System
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                navigate(isAuthenticated ? "/dashboard" : "/login")
              }
              className="primary-button"
            >
              <span>Open Logbook</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="secondary-button"
            >
              Admin Login
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, text, title }) => (
            <motion.div
              key={title}
              className="glass-panel p-5"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-200">
                <Icon size={18} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {text}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </motion.main>
  );
}
