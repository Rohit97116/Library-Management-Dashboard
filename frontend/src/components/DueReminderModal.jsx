import { BellRing, CircleAlert, AlertTriangle } from "lucide-react";
import ModalShell from "./ModalShell";
import { formatCurrency, formatShortDate } from "../utils/format";

export default function DueReminderModal({
  dueMembers,
  libraryName,
  onClose,
  onSend,
  open,
  sending,
  trialMode = false,
}) {
  const reminderCount = dueMembers.length;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Fee Due Reminder"
      subtitle={
        reminderCount > 0
          ? `${reminderCount} members currently have unpaid overdue fees.`
          : "No pending dues right now."
      }
      footer={
        <>
          <button type="button" onClick={onClose} className="secondary-button">
            Ignore
          </button>
          <button
            type="button"
            onClick={onSend}
            className="primary-button"
            disabled={sending || reminderCount === 0}
          >
            <BellRing size={16} />
            <span>
              {sending
                ? "Sending..."
                : reminderCount > 1
                  ? "Send Reminders"
                  : "Send Reminder"}
            </span>
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {trialMode && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold">Twilio Trial Mode:</span> SMS can only be sent to verified numbers. Unverified recipients will fail.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <p>
            Reminders will include your library details and admin contact information.
            <span className="font-semibold"> {libraryName || "Ambey Library"}</span>.
          </p>
        </div>

        {reminderCount === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            Nothing overdue at the moment.
          </div>
        ) : (
          <div className="space-y-3">
            {dueMembers.map((member) => (
              <div
                key={`${member.memberId}-${member.dueDate}`}
                className="rounded-lg border border-slate-200/70 bg-white/70 px-4 py-4 shadow-soft transition duration-200 hover:border-rose-300 dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-rose-400/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(member.overdueAmount)} pending - Due on {formatShortDate(member.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                      {member.overdueCount} overdue {member.overdueCount === 1 ? "month" : "months"}
                    </span>
                    {member.phoneNumber ? (
                      <span className="rounded-full bg-slate-900/5 px-3 py-1 font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {member.phoneNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}
