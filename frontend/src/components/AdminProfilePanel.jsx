import { LoaderCircle, Save, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

function buildInitialValues(profile) {
  return {
    name: profile?.name || "",
    phone: profile?.phone || "",
    libraryName: profile?.libraryName || "Ambey Library",
  };
}

export default function AdminProfilePanel({ busy, onSubmit, profile }) {
  const [formValues, setFormValues] = useState(buildInitialValues(profile));

  useEffect(() => {
    setFormValues(buildInitialValues(profile));
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      libraryName: formValues.libraryName.trim(),
    });
  }

  return (
    <div className="glass-panel px-5 py-5 md:px-6">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-5 dark:border-white/10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950">
            <Settings2 size={18} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
            Admin Settings
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            These details are stored in MongoDB and used inside the manual reminder preview.
          </p>
        </div>
      </div>

      <form className="mt-5 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="admin-name" className="field-label">
            Admin Name
          </label>
          <input
            id="admin-name"
            type="text"
            className="field-input"
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
          <label htmlFor="admin-phone" className="field-label">
            Admin Phone Number
          </label>
          <input
            id="admin-phone"
            type="text"
            className="field-input"
            value={formValues.phone}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="library-name" className="field-label">
            Library Name
          </label>
          <input
            id="library-name"
            type="text"
            className="field-input"
            value={formValues.libraryName}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                libraryName: event.target.value,
              }))
            }
            required
          />
        </div>

        <div className="md:col-span-3 flex flex-col gap-3 rounded-lg border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-950/50 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Preview message: Hello Ajay, your monthly library fee is due. Please pay as soon as possible. - {formValues.libraryName || "Ambey Library"}
          </p>
          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
