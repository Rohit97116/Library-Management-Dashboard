import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText, Download, LayoutDashboard, LogOut,
  PlusCircle, Settings2, TableProperties, X,
} from "lucide-react";
import { useRef } from "react";
import VariableProximity from "./effects/VariableProximity";

function SidebarContent({
  cycleLabel, libraryName, onClose, onExportPdf,
  onLogout, onNavigate, onOpenMemberModal, user,
}) {
  const containerRef = useRef(null);
  const items = [
    { label: "Overview",         icon: LayoutDashboard,  onClick: () => onNavigate("overview-section") },
    { label: "Logbook",          icon: TableProperties,  onClick: () => onNavigate("logbook-section") },
    { label: "Library Settings", icon: Settings2,        onClick: () => onNavigate("settings-section") },
    { label: "Add Member",       icon: PlusCircle,       onClick: onOpenMemberModal },
    { label: "Download PDF",     icon: Download,         onClick: onExportPdf },
  ];

  return (
    <div ref={containerRef} className="glass-panel relative flex h-full flex-col overflow-hidden p-4">
      {/* gold corner glow */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)]">
            <BookOpenText size={20} />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300/90">
            {libraryName || "Ambey Library"}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-50">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">Cycle {cycleLabel || "--"}</p>
        </div>
        <button type="button" className="glass-button h-10 w-10 lg:hidden" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="lux-divider my-5" />

      <nav className="space-y-1.5">
        {items.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-200 transition duration-200 hover:bg-amber-400/10 hover:text-amber-100"
          >
            <Icon size={18} className="text-amber-300/80 group-hover:text-amber-200" />
            <VariableProximity
              label={label}
              radius={90}
              falloff="linear"
              containerRef={containerRef}
              className="tracking-wide"
              fromFontVariationSettings="'wght' 500"
              toFontVariationSettings="'wght' 800"
            />
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="lux-divider mb-5" />
        <p className="text-sm font-semibold text-slate-50">{user?.name || "Admin"}</p>
        <p className="mt-1 text-xs text-slate-400">{user?.username || "library-admin"}</p>
        <button type="button" onClick={onLogout} className="secondary-button mt-5 w-full justify-center">
          <LogOut size={16} /><span>Logout</span>
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
            className="fixed inset-0 z-40 bg-slate-950/60 p-4 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="h-full max-w-[300px]"
              initial={{ x: -28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -28, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent {...props} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
