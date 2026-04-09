import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClickSpark from "../components/ClickSpark";
import GradientText from "../components/GradientText";
import ThemeToggle from "../components/ThemeToggle";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden px-4 py-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(8,47,73,0.55) 0%, rgba(15,23,42,0.15) 45%, rgba(34,197,94,0.18) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 84px)",
          backgroundSize: "200% 200%, 100% 100%",
        }}
        animate={{
          backgroundPosition: [
            "0% 50%, 0% 0%",
            "100% 50%, 0% 0%",
            "0% 50%, 0% 0%",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col">
        <header className="flex justify-end">
          <ThemeToggle />
        </header>

        <ClickSpark
          sparkColor="#22d3ee"
          sparkSize={12}
          sparkRadius={22}
          sparkCount={10}
          duration={500}
        >
          <section className="flex flex-1 items-center justify-center">
            <motion.div
              className="glass-panel w-full max-w-5xl px-6 py-12 text-center md:px-10 md:py-16"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <GradientText
                  className="text-4xl font-semibold leading-tight md:text-6xl"
                  colors={["#22d3ee", "#34d399", "#f59e0b"]}
                  animationSpeed={7}
                  direction="horizontal"
                >
                  WELCOME TO AMBEY LIBRARY
                </GradientText>
              </motion.div>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.24 }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="primary-button"
                >
                  <span>Admin Login</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          </section>
        </ClickSpark>
      </div>
    </motion.main>
  );
}
