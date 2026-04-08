import { motion } from "framer-motion";

export default function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="glass-panel w-full max-w-sm p-6 text-center">
        <motion.div
          className="mx-auto mb-4 h-12 w-12 rounded-lg border border-cyan-400/40 bg-cyan-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
        />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </p>
      </div>
    </div>
  );
}
