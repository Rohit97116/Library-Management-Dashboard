import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookshelfBackdrop from "../components/BookshelfBackdrop";
import ClickSpark from "../components/ClickSpark";
import GradientText from "../components/GradientText";
import LaserFlow from "../components/LaserFlow";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden px-4 py-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25 }}
    >
      {isDark ? (
        <LaserFlow
          color="#cf9eff"
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.05}
          horizontalSizing={0.65}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
        />
      ) : (
        <BookshelfBackdrop />
      )}

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col">
        <header className="flex justify-end">
          <ThemeToggle />
        </header>

        <ClickSpark
          sparkColor={isDark ? "#cf9eff" : "#d97706"}
          sparkSize={18}
          sparkRadius={28}
          sparkCount={12}
          duration={620}
          lineWidth={3}
          glow
        >
          {isDark ? (
            <section className="flex flex-1 items-center justify-center py-6">
              <motion.div
                className="w-full max-w-4xl rounded-lg border border-fuchsia-300/20 bg-slate-950/72 px-6 py-14 text-center shadow-[0_0_0_1px_rgba(217,70,239,0.08),0_40px_120px_rgba(76,29,149,0.35)] backdrop-blur-xl md:px-10 md:py-16"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-fuchsia-400/90 to-transparent"
                  animate={{
                    opacity: [0.45, 1, 0.45],
                    scaleX: [0.92, 1.08, 0.92],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <GradientText
                    className="text-4xl font-semibold leading-tight md:text-6xl"
                    colors={["#cf9eff", "#60a5fa", "#22d3ee"]}
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
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-fuchsia-300"
                  >
                    <span>Admin Login</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              </motion.div>
            </section>
          ) : (
            <section className="grid flex-1 items-center gap-8 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-4">
              <motion.div
                className="max-w-xl px-2 pb-10 pt-4 md:px-4 md:pt-0"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <motion.p
                  className="mb-5 text-sm font-medium uppercase tracking-[0.28em] text-teal-700/80"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Smart Library Access
                </motion.p>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <GradientText
                    className="text-5xl font-semibold leading-[1.02] text-teal-800 md:text-6xl lg:text-7xl"
                    colors={["#0f766e", "#0f766e", "#0e7490"]}
                    animationSpeed={11}
                    direction="horizontal"
                  >
                    WELCOME TO AMBEY LIBRARY
                  </GradientText>
                </motion.div>

                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.28 }}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-amber-400"
                  >
                    <span>Admin Login</span>
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              </motion.div>

              <div className="hidden md:block" />
            </section>
          )}
        </ClickSpark>
      </div>
    </motion.main>
  );
}
