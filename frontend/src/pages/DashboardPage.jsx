import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CircleAlert,
  Download,
  IndianRupee,
  Menu,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import LogbookTable from "../components/LogbookTable";
import MemberFormModal from "../components/MemberFormModal";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { formatCurrency } from "../utils/format";

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
  const { logout, token, user } = useAuth();
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
  const initialLoadRef = useRef(false);

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
        return true;
      } catch (error) {
        toast.error(error.message);
        if (error.status === 401) {
          logout();
        }
        return false;
      } finally {
        setBusyKey("");
      }
    },
    [loadDashboard, logout]
  );

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
    const success = await runMutation(
      isEditing ? `member-${memberId}` : "member-create",
      () =>
        apiRequest(isEditing ? `/members/${memberId}` : "/members", {
          method: isEditing ? "PUT" : "POST",
          token,
          body: payload,
        })
    );

    if (success) {
      setMemberModal({ open: false, member: null });
    }
  }

  async function handleDeleteMember() {
    if (!deleteTarget) {
      return;
    }

    const success = await runMutation(`delete-${deleteTarget.id}`, () =>
      apiRequest(`/members/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      })
    );

    if (success) {
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
    document.text("Ambey Library", 14, 16);
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
    <motion.main
      className="min-h-screen pb-8 lg:pl-72"
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
              <h1 className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">
                Ambey Library Dashboard
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

        <section
          id="overview-section"
          className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {summaryCards.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
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
            onTogglePayment={handleTogglePayment}
            onToggleStatus={handleToggleStatus}
          />
        </section>
      </div>

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
  );
}
