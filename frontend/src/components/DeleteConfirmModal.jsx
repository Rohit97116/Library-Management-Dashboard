import ModalShell from "./ModalShell";

export default function DeleteConfirmModal({
  member,
  onClose,
  onConfirm,
  open,
  submitting,
}) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Delete Member"
      subtitle="This keeps the rest of the logbook untouched."
      footer={
        <>
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-rose-500"
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete Member"}
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        Remove{" "}
        <span className="font-semibold text-slate-950 dark:text-white">
          {member?.name}
        </span>{" "}
        from the library record.
      </p>
    </ModalShell>
  );
}
