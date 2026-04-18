import { BellRing, CircleAlert, MessageCircle } from "lucide-react";
import ModalShell from "./ModalShell";
import { formatCurrency, formatShortDate } from "../utils/format";

export default function DueReminderModal({
  dueMembers,
  libraryName,
  onClose,
  onSendAll,
  open,
  sending,
}) {
  const reminderCount = dueMembers.length;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="WhatsApp Reminders"
      subtitle={
        reminderCount > 0
          ? `${reminderCount} members currently have unpaid overdue fees.`
          : "No pending dues right now."
      }
      footer={
        <>
          <button type="button" onClick={onClose} className="secondary-button">
            Dismiss
          </button>
          <button
            type="button"
            onClick={onSendAll}
            className="primary-button"
            disabled={sending || reminderCount === 0}
          >
            <MessageCircle size={16} />
            <span>
              {sending
                ? "Preparing..."
                : reminderCount > 1
                  ? "Open WhatsApp Reminders"
                  : "Open WhatsApp Reminder"}
            </span>
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-100">
          <MessageCircle size={18} className="mt-0.5 shrink-0" />
          <p>
            Reminders will be sent via WhatsApp with your admin details.
            <span className="font-semibold"> {libraryName || "Ambey Library"}</span>
            . Click to open WhatsApp and send manually.
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
                className="rounded-lg border border-slate-200/70 bg-white/70 px-4 py-4 shadow-soft transition duration-200 hover:border-green-300 dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-green-400/30"
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
                      <span className="rounded-full bg-green-500/10 px-3 py-1 font-medium text-green-600 dark:bg-green-500/20 dark:text-green-200">
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
