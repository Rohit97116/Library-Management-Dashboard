// Single source of truth for "is this member actionable?"
// Path A: based purely on member.status === "active" | "inactive".
export function isMemberActive(member) {
  if (!member) return false;
  return (member.status ?? "active") === "active";
}

export function isMemberInactive(member) {
  return !isMemberActive(member);
}

// Filter helper for due/reminder lists. Backend's `dueMembers` entries
// carry memberId + status (when present). If status missing, fall back
// to looking the member up in the full members list.
export function filterActiveDueMembers(dueMembers, allMembers) {
  if (!Array.isArray(dueMembers)) return [];
  const inactiveIds = new Set(
    (allMembers || [])
      .filter((m) => isMemberInactive(m))
      .map((m) => m.id)
  );
  return dueMembers.filter((entry) => {
    if (entry.status && entry.status !== "active") return false;
    return !inactiveIds.has(entry.memberId);
  });
}
