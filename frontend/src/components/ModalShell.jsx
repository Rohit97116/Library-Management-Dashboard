import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-4 py-4 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel w-full max-w-2xl overflow-hidden"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-5 dark:border-white/10">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  {title}
                </h2>
                {subtitle ? (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-button h-10 w-10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
            {footer ? (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
