import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  LoaderCircle,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(formValues);
      toast.success("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.main
      className="min-h-screen px-4 py-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="secondary-button">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <ThemeToggle />
        </header>

        <section className="glass-panel px-6 py-8 md:px-8 md:py-9">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950">
            <BookOpenText size={18} />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Continue to the Ambey Library Dashboard.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <div className="relative">
                <UserRound
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="username"
                  type="text"
                  className="field-input pl-11"
                  placeholder="Enter username"
                  value={formValues.username}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type="password"
                  className="field-input pl-11"
                  placeholder="Enter password"
                  value={formValues.password}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-button w-full justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Open Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </motion.main>
  );
}
