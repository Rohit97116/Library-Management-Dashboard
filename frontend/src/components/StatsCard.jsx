import { motion } from "framer-motion";

const toneClasses = {
  cyan: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-200",
  emerald:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-200",
  amber:
    "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-200",
  rose: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-500/20 dark:text-rose-200",
};

export default function StatsCard({
  icon: Icon,
  title,
  value,
  description,
  tone = "cyan",
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="glass-panel p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
            toneClasses[tone]
          }`}
        >
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}
