import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText,
  Download,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings2,
  TableProperties,
  X,
} from "lucide-react";

function SidebarContent({
  cycleLabel,
  libraryName,
  onClose,
  onExportPdf,
  onLogout,
  onNavigate,
  onOpenMemberModal,
  user,
}) {
  const items = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      onClick: () => onNavigate("overview-section"),
    },
    {
      label: "Logbook",
      icon: TableProperties,
      onClick: () => onNavigate("logbook-section"),
    },
    {
      label: "Library Settings",
      icon: Settings2,
      onClick: () => onNavigate("settings-section"),
    },
    {
      label: "Add Member",
      icon: PlusCircle,
      onClick: onOpenMemberModal,
    },
    {
      label: "Download PDF",
      icon: Download,
      onClick: onExportPdf,
    },
  ];

  return (
    <div className="glass-panel flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950">
            <BookOpenText size={20} />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            {libraryName || "Ambey Library"}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Cycle {cycleLabel || "--"}
          </p>
        </div>
        <button
          type="button"
          className="glass-button h-10 w-10 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {items.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition duration-200 hover:bg-cyan-500/10 hover:text-cyan-700 dark:text-slate-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-200/70 pt-5 dark:border-white/10">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {user?.name || "Admin"}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {user?.username || "library-admin"}
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="secondary-button mt-5 w-full justify-center"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar(props) {
  const { open, onClose } = props;

  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72 lg:p-4">
        <SidebarContent {...props} />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/40 p-4 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="h-full max-w-[300px]"
              initial={{ x: -28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent {...props} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
