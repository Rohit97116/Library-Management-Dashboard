import { useEffect, useMemo, useState } from "react";
import ModalShell from "./ModalShell";

function createInitialState() {
  return {
    name: "",
    dateOfJoining: new Date().toISOString().slice(0, 10),
    monthlyFee: "1200",
    phoneNumber: "",
    status: "active",
  };
}

export default function MemberFormModal({
  member,
  onClose,
  onSubmit,
  open,
  submitting,
}) {
  const [formValues, setFormValues] = useState(createInitialState);
  const isEditing = useMemo(() => Boolean(member), [member]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (member) {
      setFormValues({
        name: member.name || "",
        dateOfJoining: member.dateOfJoining?.slice(0, 10) || "",
        monthlyFee: String(member.monthlyFee ?? ""),
        phoneNumber: member.phoneNumber || member.phone || "",
        status: member.status || "active",
      });
      return;
    }

    setFormValues(createInitialState());
  }, [member, open]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      ...formValues,
      monthlyFee: Number(formValues.monthlyFee),
    });
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Member" : "Add Member"}
      subtitle="Each month stays anchored to the member's joining day."
      footer={
        <>
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button
            type="submit"
            form="member-form"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Member"}
          </button>
        </>
      }
    >
      <form
        id="member-form"
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label htmlFor="member-name" className="field-label">
            Member Name
          </label>
          <input
            id="member-name"
            type="text"
            className="field-input"
            placeholder="Rohit Sharma"
            value={formValues.name}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="joining-date" className="field-label">
            Date of Joining
          </label>
          <input
            id="joining-date"
            type="date"
            className="field-input"
            value={formValues.dateOfJoining}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                dateOfJoining: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="monthly-fee" className="field-label">
            Monthly Fee
          </label>
          <input
            id="monthly-fee"
            type="number"
            min="0"
            className="field-input"
            value={formValues.monthlyFee}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                monthlyFee: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="member-phone" className="field-label">
            Phone Number
          </label>
          <input
            id="member-phone"
            type="text"
            className="field-input"
            placeholder="9876543210"
            value={formValues.phoneNumber}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                phoneNumber: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="member-status" className="field-label">
            Status
          </label>
          <select
            id="member-status"
            className="field-input"
            value={formValues.status}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>
    </ModalShell>
  );
}
