import ClickSpark from "../components/effects/ClickSpark";
import ShinyText from "../components/effects/ShinyText";
import { filterActiveDueMembers } from "../utils/memberStatus";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BellRing,
  CircleAlert,
  Download,
  IndianRupee,
  Menu,
  MessageCircle,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import AdminProfilePanel from "../components/AdminProfilePanel";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DueReminderModal from "../components/DueReminderModal";
import LogbookTable from "../components/LogbookTable";
import MagicBento from "../components/MagicBento";
import MemberFormModal from "../components/MemberFormModal";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";
import { apiRequest } from "../lib/api";
import { formatCurrency } from "../utils/format";
import {
  generateWhatsAppLink,
  openWhatsAppReminder,
  normalizePhoneForWhatsApp,
} from "../utils/whatsapp";

function buildQueryString(searchText, statusFilter) {
  const params = new URLSearchParams();

  if (searchText.trim()) {
    params.set("search", searchText.trim());
  }

  if (statusFilter !== "all") {
    params.set("status", statusFilter);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export default function DashboardPage() {
  const { logout, token, updateUser, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyKey, setBusyKey] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [memberModal, setMemberModal] = useState({
    open: false,
    member: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const initialLoadRef = useRef(false);
  const seenDueSignatureRef = useRef("");

  const loadDashboard = useCallback(
    async ({ signal } = {}) => {
      try {
        if (initialLoadRef.current) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await apiRequest(
          `/members${buildQueryString(searchText, statusFilter)}`,
          {
            token,
            signal,
          }
        );

        setDashboard(response);
        initialLoadRef.current = true;
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        toast.error(error.message);
        if (error.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [logout, searchText, statusFilter, token]
  );

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      loadDashboard({ signal: controller.signal });
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [loadDashboard]);

  const runMutation = useCallback(
    async (key, action) => {
      try {
        setBusyKey(key);
        const response = await action();

        if (response?.message) {
          toast.success(response.message);
        }

        await loadDashboard();
        return { ok: true, response };
      } catch (error) {
        toast.error(error.message);
        if (error.status === 401) {
          logout();
        }
        return { ok: false, error };
      } finally {
        setBusyKey("");
      }
    },
    [loadDashboard, logout]
  );

  const allMembers = dashboard?.members || [];
const dueMembers = useMemo(
  () => filterActiveDueMembers(dashboard?.dueMembers || [], allMembers),
  [dashboard?.dueMembers, allMembers]
);
  const dueSignature = useMemo(
    () =>
      dueMembers
        .map((entry) => `${entry.memberId}:${entry.monthKeys.join(",")}:${entry.dueDate}`)
        .join("|"),
    [dueMembers]
  );

  useEffect(() => {
    if (!dueSignature) {
      seenDueSignatureRef.current = "";
      return;
    }

    if (loading || refreshing) {
      return;
    }

    if (seenDueSignatureRef.current === dueSignature) {
      return;
    }

    seenDueSignatureRef.current = dueSignature;
    setReminderModalOpen(true);
  }, [dueSignature, loading, refreshing]);

  const summaryCards = useMemo(() => {
    const summary = dashboard?.summary;
    if (!summary) {
      return [];
    }

    return [
      {
        icon: Users,
        title: "Active Members",
        value: summary.activeMembers,
        description: `${summary.totalMembers} total records`,
        tone: "cyan",
      },
      {
        icon: CircleAlert,
        title: "Pending Payments",
        value: summary.pendingPayments,
        description: `${summary.inactiveMembers} inactive members`,
        tone: "amber",
      },
      {
        icon: IndianRupee,
        title: "Collected This Month",
        value: formatCurrency(summary.currentMonthCollected),
        description: `${formatCurrency(summary.currentMonthExpected)} expected`,
        tone: "emerald",
      },
      {
        icon: WalletCards,
        title: "Cycle Revenue",
        value: formatCurrency(summary.cycleCollected),
        description: `${formatCurrency(summary.cycleExpected)} for this cycle`,
        tone: "rose",
      },
    ];
  }, [dashboard]);

  // Show loading state while fetching dashboard data
  if (loading && !dashboard) {
    return <PageLoader label="Loading your dashboard..." />;
  }

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMobileSidebarOpen(false);
  }

  async function handleMemberSubmit(payload) {
    const isEditing = Boolean(memberModal.member);
    const memberId = memberModal.member?.id;
    const result = await runMutation(
      isEditing ? `member-${memberId}` : "member-create",
      () =>
        apiRequest(isEditing ? `/members/${memberId}` : "/members", {
          method: isEditing ? "PUT" : "POST",
          token,
          body: payload,
        })
    );

    if (result.ok) {
      setMemberModal({ open: false, member: null });
    }
  }

  async function handleDeleteMember() {
    if (!deleteTarget) {
      return;
    }

    const result = await runMutation(`delete-${deleteTarget.id}`, () =>
      apiRequest(`/members/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      })
    );

    if (result.ok) {
      setDeleteTarget(null);
    }
  }

  async function handleToggleStatus(memberId) {
    await runMutation(`status-${memberId}`, () =>
      apiRequest(`/members/${memberId}/status`, {
        method: "PATCH",
        token,
      })
    );
  }

  async function handleTogglePayment(memberId, monthIndex) {
    if (!dashboard) {
      return;
    }

    await runMutation(`payment-${memberId}-${monthIndex}`, () =>
      apiRequest(`/members/${memberId}/payments`, {
        method: "PATCH",
        token,
        body: {
          cycleYear: dashboard.cycleYear,
          monthIndex,
        },
      })
    );
  }

  function handleSendMemberReminder(member) {
    if (!member.overdueCount) {
      toast("No pending dues.");
      return;
    }

    if (!member.canSendReminder) {
      toast.error("This member does not have a valid phone number.");
      return;
    }

    // Extract overdue months from member data
    const overdueMonths = (member.months || [])
      .filter((month) => month.isOverdue)
      .map((month) => ({
        label: month.label,
        dueDate: month.dueDate,
        amount: member.monthlyFee,
      }));

    const totalOverdueAmount = overdueMonths.length * member.monthlyFee;

    // Open WhatsApp with prefilled message
    const adminProfile = dashboard?.adminProfile;
    try {
      toast.loading("Opening WhatsApp...", { duration: 1000 });
      openWhatsAppReminder({
        phoneNumber: member.phoneNumber,
        memberName: member.name,
        adminName: adminProfile?.name || "Library Admin",
        libraryName: adminProfile?.libraryName || "Ambey Library",
        adminPhone: adminProfile?.phone || "",
        // Pass all overdue months for multi-month message
        overdueMonths,
        totalAmount: totalOverdueAmount,
      });

      // Log the reminder action
      apiRequest(`/members/${member.id}/reminders/whatsapp`, {
        method: "POST",
        token,
      }).catch(() => {
        // Silently fail - logging is not critical
      });

      toast.success(`WhatsApp opened for ${member.name}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleSendAllReminders() {
    if (!dueMembers.length) {
      toast("No pending dues found.");
      setReminderModalOpen(false);
      return;
    }

    const adminProfile = dashboard?.adminProfile;
    let successCount = 0;
    let errorCount = 0;

    // Open WhatsApp for each due member
    dueMembers.forEach((dueEntry) => {
      if (!dueEntry.canSendReminder) {
        errorCount++;
        return;
      }

      try {
        openWhatsAppReminder({
          phoneNumber: dueEntry.phoneNumber,
          memberName: dueEntry.name,
          adminName: adminProfile?.name || "Library Admin",
          libraryName: adminProfile?.libraryName || "Ambey Library",
          adminPhone: adminProfile?.phone || "",
          // Pass all overdue months from backend data
          overdueMonths: dueEntry.overdueMonths,
          totalAmount: dueEntry.overdueAmount,
        });

        successCount++;

        // Log the reminder action
        apiRequest(`/members/${dueEntry.memberId}/reminders/whatsapp`, {
          method: "POST",
          token,
        }).catch(() => {
          // Silently fail - logging is not critical
        });
      } catch (error) {
        errorCount++;
      }
    });

    setReminderModalOpen(false);

    if (successCount > 0 && errorCount === 0) {
      toast.success(
        `${successCount} WhatsApp reminder${successCount > 1 ? "s" : ""} opened!`
      );
    } else if (successCount > 0) {
      toast.success(
        `${successCount} opened, ${errorCount} failed.`
      );
    } else {
      toast.error("Failed to open WhatsApp reminders.");
    }
  }

  async function handleSaveAdminProfile(payload) {
    try {
      setBusyKey("admin-profile");
      const response = await apiRequest("/admin/profile", {
        method: "PUT",
        token,
        body: payload,
      });

      if (response?.message) {
        toast.success(response.message);
      }

      if (response?.user) {
        updateUser(response.user);
      }

      setDashboard((current) =>
        current
          ? {
              ...current,
              adminProfile: response.profile,
            }
          : current
      );

      await loadDashboard();
    } catch (error) {
      toast.error(error.message);
      if (error.status === 401) {
        logout();
      }
    } finally {
      setBusyKey("");
    }
  }

  function handleExportPdf() {
    if (!dashboard?.members?.length) {
      toast.error("No members available for export.");
      return;
    }

    const document = new jsPDF({
      orientation: "landscape",
      format: "a3",
    });

    document.setFontSize(18);
    document.text(dashboard.adminProfile?.libraryName || "Ambey Library", 14, 16);
    document.setFontSize(10);
    document.text(`Cycle ${dashboard.cycleLabel}`, 14, 23);

    autoTable(document, {
      startY: 30,
      theme: "grid",
      head: [
        [
          "Status",
          "S.No",
          "Member Name",
          "Date of Joining",
          ...dashboard.months.map((month) => month.label),
        ],
      ],
      body: dashboard.members.map((member, index) => [
        member.status === "active" ? "Active" : "Inactive",
        index + 1,
        member.name,
        member.dateOfJoining?.slice(0, 10),
        ...member.months.map((month) =>
          !month.isApplicable
            ? "N/A"
            : month.isPaid
              ? "Paid"
              : month.isOverdue
                ? "Due"
                : "Open"
        ),
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2.2,
        textColor: [15, 23, 42],
      },
      headStyles: {
        fillColor: [15, 23, 42],
      },
      didParseCell: (data) => {
        if (data.section !== "body") {
          return;
        }

        const member = dashboard.members[data.row.index];
        if (!member) {
          return;
        }

        if (member.status === "inactive" && data.column.index < 4) {
          data.cell.styles.fillColor = [253, 230, 138];
        }

        if (data.column.index >= 4) {
          const month = member.months[data.column.index - 4];
          if (!month) {
            return;
          }

          if (month.tone === "paid") {
            data.cell.styles.fillColor = [74, 222, 128];
            data.cell.styles.textColor = [20, 20, 20];
          } else if (month.tone === "overdue") {
            data.cell.styles.fillColor = [251, 113, 133];
            data.cell.styles.textColor = [255, 255, 255];
          } else if (month.tone === "na") {
            data.cell.styles.fillColor = [226, 232, 240];
          }
        }
      },
    });

    document.save(`ambey-library-${dashboard.cycleLabel}.pdf`);
    toast.success("PDF downloaded.");
  }

  return (
    <ClickSpark sparkColor="#D4AF37" sparkCount={10} sparkRadius={20}>
      <motion.main
        className="relative min-h-screen pb-8 lg:pl-72"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.25 }}
      >
      <Sidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onNavigate={scrollToSection}
        onOpenMemberModal={() => {
          setMemberModal({ open: true, member: null });
          setMobileSidebarOpen(false);
        }}
        onExportPdf={() => {
          handleExportPdf();
          setMobileSidebarOpen(false);
        }}
        onLogout={logout}
        cycleLabel={dashboard?.cycleLabel}
        libraryName={dashboard?.adminProfile?.libraryName}
        user={user}
      />

      <div className="px-4 pt-4 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="glass-button h-11 w-11 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Welcome back, {user?.name || "Admin"}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold">
                <ShinyText text={`${dashboard?.adminProfile?.libraryName || "Ambey Library"} Dashboard`} speed={5} />
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {dashboard ? `Cycle ${dashboard.cycleLabel}` : "Loading cycle"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadDashboard()}
              className="secondary-button"
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : undefined}
              />
              <span>Refresh</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        <section id="overview-section" className="mt-6">
          <MagicBento
            items={summaryCards}
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
            renderItem={(card) => {
              const Icon = card.icon;
              const toneClasses = {
                cyan:
                  "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-200",
                emerald:
                  "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-200",
                amber:
                  "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-200",
                rose:
                  "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-500/20 dark:text-rose-200",
              };

              return (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {card.title}
                    </p> 
                    <p className="mt-3 text-2xl font-semibold">
                      <ShinyText text={String(card.value)} speed={6} />
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {card.description}
                    </p>
                  </div>
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
                      toneClasses[card.tone]
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                </div>
              );
            }}
          />
        </section>

        <section id="controls-section" className="glass-panel mt-6 px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  className="field-input pl-11"
                  placeholder="Search members"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>

              <select
                className="field-input sm:max-w-[190px]"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSendAllReminders}
                className="secondary-button"
                disabled={busyKey === "reminders-all"}
              >
                <BellRing size={16} />
                <span>
                  {busyKey === "reminders-all"
                    ? "Sending..."
                    : "Send All Reminders"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMemberModal({ open: true, member: null })}
                className="primary-button"
              >
                <UserPlus size={16} />
                <span>Add Member</span>
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="secondary-button"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-900/5 px-3 py-1 dark:bg-white/10">
              {dashboard?.members?.length || 0} visible members
            </span>
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
              {dueMembers.length ? `${dueMembers.length} due reminders ready` : "No pending dues"}
            </span>
          </div>
        </section>

        <section id="logbook-section" className="mt-6">
          <LogbookTable
            busyKey={busyKey}
            cycleLabel={dashboard?.cycleLabel || "--"}
            loading={loading || refreshing}
            members={dashboard?.members || []}
            months={dashboard?.months || []}
            onDeleteMember={(member) => setDeleteTarget(member)}
            onEditMember={(member) => setMemberModal({ open: true, member })}
            onSendReminder={handleSendMemberReminder}
            onTogglePayment={handleTogglePayment}
            onToggleStatus={handleToggleStatus}
          />
        </section>

        <section id="settings-section" className="mt-6">
          <AdminProfilePanel
            busy={busyKey === "admin-profile"}
            profile={dashboard?.adminProfile}
            onSubmit={handleSaveAdminProfile}
          />
        </section>
      </div>

      <DueReminderModal
        open={reminderModalOpen}
        dueMembers={dueMembers}
        libraryName={dashboard?.adminProfile?.libraryName}
        onClose={() => setReminderModalOpen(false)}
        onSendAll={handleSendAllReminders}
        sending={busyKey === "reminders-all"}
      />

      <MemberFormModal
        open={memberModal.open}
        member={memberModal.member}
        onClose={() => setMemberModal({ open: false, member: null })}
        onSubmit={handleMemberSubmit}
        submitting={busyKey === "member-create" || busyKey.startsWith("member-")}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        member={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteMember}
        submitting={Boolean(deleteTarget && busyKey === `delete-${deleteTarget.id}`)}
      />
    </motion.main>
    </ClickSpark>
  );
}
