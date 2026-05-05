import { motion } from "framer-motion";
import { MessageCircle, Edit3, Trash2, Lock } from "lucide-react";
import {
  formatCurrency, formatDate, formatMonthCaption, formatShortDate,
} from "../utils/format";
import { isMemberInactive } from "../utils/memberStatus";

const monthToneClasses = {
  paid:     "border-emerald-500/40 bg-emerald-600 text-white",
  overdue:  "border-rose-500/40 bg-rose-600 text-white",
  upcoming: "border-amber-200/15 bg-slate-950/70 text-slate-100 hover:border-amber-300/50 hover:text-amber-100",
  na:       "border-transparent bg-slate-900/70 text-slate-600",
};

function PaymentCell({ busy, month, onClick, locked }) {
  const isDisabled = !month.isApplicable || busy || locked;
  const stateLabel = locked
    ? "—"
    : !month.isApplicable
      ? "N/A"
      : month.isPaid ? "Paid" : month.isOverdue ? "Due" : "Open";

  return (
    <motion.button
      type="button"
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full rounded-lg border px-2 py-2 text-center transition duration-200 ${
        locked ? "border-rose-500/30 bg-slate-900/50 text-slate-500" : monthToneClasses[month.tone]
      } ${isDisabled && month.isApplicable && !locked ? "cursor-wait opacity-70" : ""} ${
        (!month.isApplicable || locked) ? "cursor-not-allowed" : ""
      }`}
      title={locked ? "Member is inactive" : undefined}
    >
      <span className="block text-xs font-semibold">{stateLabel}</span>
      <span className="mt-1 block text-[10px] font-medium opacity-80">
        {formatMonthCaption(month)}
      </span>
    </motion.button>
  );
}

export default function LogbookTable({
  busyKey, cycleLabel, loading, members, months,
  onDeleteMember, onEditMember, onSendReminder, onTogglePayment, onToggleStatus,
}) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-amber-200/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Member Logbook</h2>
          <p className="mt-1 text-sm text-amber-200/70">Cycle {cycleLabel}</p>
        </div>
        <p className="text-sm text-slate-400">
          {loading ? "Refreshing records..." : `${members.length} members`}
        </p>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[1600px] border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-amber-200/90 backdrop-blur">
            <tr>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Status</th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">S.No</th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Member Name</th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Seat No.</th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Seat Type</th>
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Date of Joining</th>
              {months.map((month) => (
                <th key={month.index} className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                  {month.label}
                </th>
              ))}
              <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={months.length + 7} className="px-6 py-14 text-center text-sm text-slate-500">
                  No members match this filter.
                </td>
              </tr>
            ) : null}

            {members.map((member, index) => {
              const inactive    = isMemberInactive(member);
              const statusBusy  = busyKey === `status-${member.id}`;
              const deleteBusy  = busyKey === `delete-${member.id}`;
              const editBusy    = busyKey === `member-${member.id}`;
              const reminderBusy= busyKey === `reminder-${member.id}`;
              const hasDue      = !inactive && member.overdueCount > 0;

              return (
                <tr
                  key={member.id}
                  className={`border-b border-amber-200/5 transition duration-200 ${
                    inactive
                      ? "bg-slate-900/40 opacity-55 grayscale-[0.4]"
                      : hasDue
                        ? "bg-rose-500/[0.05] shadow-[inset_0_0_0_1px_rgba(244,63,94,0.15)]"
                        : "hover:bg-amber-400/[0.04]"
                  }`}
                >
                  <td className="px-3 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(member.id)}
                      disabled={statusBusy}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        inactive
                          ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40 hover:bg-rose-500/25"
                          : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
                      } ${statusBusy ? "cursor-wait opacity-70" : ""}`}
                    >
                      {inactive && <Lock size={12} />}
                      {inactive ? "Inactive" : "Active"}
                    </button>
                  </td>
                  <td className="px-3 py-3 align-top text-sm font-medium text-slate-400">{index + 1}</td>
                  <td className="px-3 py-3 align-top">
                    <div className="min-w-[240px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-50">{member.name}</p>
                        {hasDue ? (
                          <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-300 animate-pulse">
                            Fee Due
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatCurrency(member.monthlyFee)} / month
                        {member.phoneNumber ? ` - ${member.phoneNumber}` : ""}
                      </p>
                      {hasDue || member.reminderLastSentAt ? (
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          {hasDue ? (
                            <span className="rounded-full bg-rose-500/15 px-2.5 py-1 font-medium text-rose-300">
                              {formatCurrency(member.overdueAmount)} pending
                            </span>
                          ) : null}
                          {member.dueDate ? (
                            <span className="rounded-full bg-white/5 px-2.5 py-1 font-medium text-slate-300">
                              Due {formatShortDate(member.dueDate)}
                            </span>
                          ) : null}
                          {member.reminderLastSentAt ? (
                            <span className="rounded-full bg-amber-400/10 px-2.5 py-1 font-medium text-amber-200">
                              Reminder {formatShortDate(member.reminderLastSentAt)}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-slate-300">
                    {member.seatNo || "-"}
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-slate-300">
                    {member.seatType || "-"}
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-slate-300">
                    {formatDate(member.dateOfJoining)}
                  </td>

                  {member.months.map((month) => (
                    <td key={month.key} className="px-3 py-3 align-top">
                      <div className="min-w-[92px]">
                        <PaymentCell
                          month={month}
                          busy={busyKey === `payment-${member.id}-${month.index}`}
                          onClick={() => onTogglePayment(member.id, month.index)}
                          locked={inactive}
                        />
                      </div>
                    </td>
                  ))}

                  <td className="px-3 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSendReminder(member)}
                        disabled={inactive || reminderBusy || !member.canSendReminder || !hasDue}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition duration-200 ${
                          !inactive && member.canSendReminder && hasDue
                            ? "border-emerald-500/30 bg-slate-900/60 text-emerald-300 hover:-translate-y-0.5 hover:bg-emerald-500/10"
                            : "cursor-not-allowed border-amber-200/10 bg-slate-900/40 text-slate-600"
                        }`}
                        aria-label={`Send WhatsApp reminder to ${member.name}`}
                        title={inactive ? "Member is inactive" : undefined}
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
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/25 bg-slate-900/60 text-rose-300 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-500/10"
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
