import { motion } from "framer-motion";
import { MessageCircle, Edit3, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatMonthCaption,
  formatShortDate,
} from "../utils/format";

const monthToneClasses = {
  paid: "border-emerald-500/30 bg-emerald-500 text-white dark:border-emerald-400/30 dark:bg-emerald-500",
  overdue:
    "border-rose-500/30 bg-rose-500 text-white dark:border-rose-400/30 dark:bg-rose-500",
  upcoming:
    "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200",
  na: "border-transparent bg-slate-200/80 text-slate-400 dark:bg-slate-900/80 dark:text-slate-600",
};

function PaymentCell({ busy, month, onClick }) {
  const isDisabled = !month.isApplicable || busy;
  const stateLabel = !month.isApplicable
    ? "N/A"
    : month.isPaid
      ? "Paid"
      : month.isOverdue
        ? "Due"
        : "Open";

  return (
    <motion.button
      type="button"
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full rounded-lg border px-2 py-2 text-center transition duration-200 ${
        monthToneClasses[month.tone]
      } ${isDisabled && month.isApplicable ? "cursor-wait opacity-70" : ""} ${
        !month.isApplicable ? "cursor-not-allowed" : ""
      }`}
    >
      <span className="block text-xs font-semibold">{stateLabel}</span>
      <span className="mt-1 block text-[10px] font-medium opacity-80">
        {formatMonthCaption(month)}
      </span>
    </motion.button>
  );
}

export default function LogbookTable({
  busyKey,
  cycleLabel,
  loading,
  members,
  months,
  onDeleteMember,
  onEditMember,
  onSendReminder,
  onTogglePayment,
  onToggleStatus,
}) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 md:flex-row md:items-center md:justify-between dark:border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Member Logbook
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cycle {cycleLabel}
          </p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Refreshing records..." : `${members.length} members`}
        </p>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[1600px] border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-950 text-white dark:bg-slate-900">
            <tr>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                Status
              </th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                S.No
              </th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                Member Name
              </th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                Date of Joining
              </th>
              {months.map((month) => (
                <th
                  key={month.index}
                  className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]"
                >
                  {month.label}
                </th>
              ))}
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={months.length + 5}
                  className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No members match this filter.
                </td>
              </tr>
            ) : null}

            {members.map((member, index) => {
              const statusBusy = busyKey === `status-${member.id}`;
              const deleteBusy = busyKey === `delete-${member.id}`;
              const editBusy = busyKey === `member-${member.id}`;
              const reminderBusy = busyKey === `reminder-${member.id}`;
              const hasDue = member.overdueCount > 0;

              return (
                <tr
                  key={member.id}
                  className={`border-b border-slate-200/70 transition duration-200 hover:bg-cyan-500/5 dark:border-white/10 dark:hover:bg-cyan-500/6 ${
                    member.status === "inactive"
                      ? "bg-amber-200/40 dark:bg-amber-500/10"
                      : ""
                  } ${
                    hasDue
                      ? "bg-rose-500/[0.04] shadow-[inset_0_0_0_1px_rgba(244,63,94,0.12),0_0_32px_rgba(244,63,94,0.04)] dark:bg-rose-500/[0.06]"
                      : ""
                  }`}
                >
                  <td className="px-3 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(member.id)}
                      disabled={statusBusy}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        member.status === "active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-200"
                          : "bg-amber-500/20 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-200"
                      } ${statusBusy ? "cursor-wait opacity-70" : ""}`}
                    >
                      {member.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-3 align-top text-sm font-medium text-slate-500 dark:text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="min-w-[240px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">
                          {member.name}
                        </p>
                        {hasDue ? (
                          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 animate-pulse dark:bg-rose-500/20 dark:text-rose-200">
                            Fee Due
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {formatCurrency(member.monthlyFee)} / month
                        {member.phoneNumber ? ` - ${member.phoneNumber}` : ""}
                      </p>
                      {hasDue || member.reminderLastSentAt ? (
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          {hasDue ? (
                            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 font-medium text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                              {formatCurrency(member.overdueAmount)} pending
                            </span>
                          ) : null}
                          {member.dueDate ? (
                            <span className="rounded-full bg-slate-900/5 px-2.5 py-1 font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                              Due {formatShortDate(member.dueDate)}
                            </span>
                          ) : null}
                          {member.reminderLastSentAt ? (
                            <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 font-medium text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200">
                              Reminder {formatShortDate(member.reminderLastSentAt)}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(member.dateOfJoining)}
                  </td>

                  {member.months.map((month) => (
                    <td key={month.key} className="px-3 py-3 align-top">
                      <div className="min-w-[92px]">
                        <PaymentCell
                          month={month}
                          busy={busyKey === `payment-${member.id}-${month.index}`}
                          onClick={() => onTogglePayment(member.id, month.index)}
                        />
                      </div>
                    </td>
                  ))}

                  <td className="px-3 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSendReminder(member)}
                        disabled={reminderBusy || !member.canSendReminder || !hasDue}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition duration-200 ${
                          member.canSendReminder && hasDue
                            ? "border-green-200 bg-white text-green-700 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50 dark:border-green-500/20 dark:bg-slate-900 dark:text-green-200 dark:hover:bg-green-500/10"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-600"
                        }`}
                        aria-label={`Send WhatsApp reminder to ${member.name}`}
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditMember(member)}
                        disabled={editBusy}
                        className="glass-button h-10 w-10"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteMember(member)}
                        disabled={deleteBusy}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 dark:border-rose-500/20 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        aria-label={`Delete ${member.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
