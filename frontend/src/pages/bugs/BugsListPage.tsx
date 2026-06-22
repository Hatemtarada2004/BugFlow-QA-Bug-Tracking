import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import type { Bug, Project } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { priorityColor, statusColor, formatDate } from "../../utils";
import { useAuth } from "../../context/AuthContext";

const LIMIT = 20;

const priorityDot: Record<string, string> = {
  LOW:      "bg-emerald-400",
  MEDIUM:   "bg-amber-400",
  HIGH:     "bg-orange-400",
  CRITICAL: "bg-rose-500",
};

const severityBadge: Record<string, string> = {
  TRIVIAL:  "text-slate-500  bg-slate-100",
  MINOR:    "text-sky-700    bg-sky-50",
  MAJOR:    "text-amber-700  bg-amber-50",
  CRITICAL: "text-orange-700 bg-orange-50",
  BLOCKER:  "text-rose-700   bg-rose-50",
};

// ─── CSV helpers ─────────────────────────────────────────────────────────────

const toCSV = (bugs: Bug[]): string => {
  const header = ["ID", "Title", "Project", "Priority", "Severity", "Status", "Assigned To", "Reporter", "Created"];
  const rows = bugs.map((b) => [
    b.id,
    `"${b.title.replace(/"/g, '""')}"`,
    `"${b.project.name.replace(/"/g, '""')}"`,
    b.priority,
    b.severity,
    b.status,
    b.assignedTo?.name ?? "",
    b.createdBy.name,
    new Date(b.createdAt).toLocaleDateString(),
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Component ───────────────────────────────────────────────────────────────

export const BugsListPage = () => {
  const { user } = useAuth();
  const { t }    = useTranslation();

  const [bugs,          setBugs]          = useState<Bug[]>([]);
  const [total,         setTotal]         = useState(0);
  const [projects,      setProjects]      = useState<Project[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [exporting,     setExporting]     = useState(false);

  // filter state (two-tier search for debounce)
  const [search,        setSearch]        = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusF,       setStatusF]       = useState("");
  const [priorityF,     setPriorityF]     = useState("");
  const [severityF,     setSeverityF]     = useState("");
  const [projectF,      setProjectF]      = useState("");
  const [sortOrder,     setSortOrder]     = useState("desc");
  const [page,          setPage]          = useState(1);

  // Load projects on mount
  useEffect(() => {
    api.get<{ projects: Project[] }>("/projects").then((r) => setProjects(r.data.projects));
  }, []);

  // Debounce: commit search after 350ms idle
  useEffect(() => {
    const t = setTimeout(() => { setAppliedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Main load — runs whenever any filter or page changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const p = new URLSearchParams();
      if (appliedSearch) p.set("search",    appliedSearch);
      if (statusF)       p.set("status",    statusF);
      if (priorityF)     p.set("priority",  priorityF);
      if (severityF)     p.set("severity",  severityF);
      if (projectF)      p.set("projectId", projectF);
      p.set("sortOrder", sortOrder);
      p.set("page",      String(page));
      p.set("limit",     String(LIMIT));
      const res = await api.get<{ bugs: Bug[]; total: number }>(`/bugs?${p}`);
      if (!cancelled) {
        setBugs(res.data.bugs);
        setTotal(res.data.total ?? 0);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appliedSearch, statusF, priorityF, severityF, projectF, sortOrder, page]);

  // Export — fetches all matching bugs (no pagination limit)
  const exportCSV = async () => {
    setExporting(true);
    const p = new URLSearchParams();
    if (appliedSearch) p.set("search",    appliedSearch);
    if (statusF)       p.set("status",    statusF);
    if (priorityF)     p.set("priority",  priorityF);
    if (severityF)     p.set("severity",  severityF);
    if (projectF)      p.set("projectId", projectF);
    p.set("sortOrder", sortOrder);
    p.set("limit", "9999");
    const res = await api.get<{ bugs: Bug[] }>(`/bugs?${p}`);
    downloadCSV(toCSV(res.data.bugs), `bugflow-${new Date().toISOString().slice(0, 10)}.csv`);
    setExporting(false);
  };

  const clearAll = () => {
    setSearch(""); setAppliedSearch("");
    setStatusF(""); setPriorityF(""); setSeverityF(""); setProjectF("");
    setSortOrder("desc"); setPage(1);
  };

  const hasFilters = appliedSearch || statusF || priorityF || severityF || projectF;
  const totalPages  = Math.ceil(total / LIMIT);

  const chips = [
    appliedSearch && { label: `"${appliedSearch}"`,                                            clear: () => { setSearch(""); setAppliedSearch(""); setPage(1); } },
    statusF       && { label: statusF.replace("_", " "),                                       clear: () => { setStatusF("");   setPage(1); } },
    priorityF     && { label: priorityF,                                                        clear: () => { setPriorityF(""); setPage(1); } },
    severityF     && { label: severityF,                                                        clear: () => { setSeverityF(""); setPage(1); } },
    projectF      && { label: projects.find((p) => p.id === projectF)?.name ?? "Project",      clear: () => { setProjectF("");  setPage(1); } },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const sel = "px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-colors cursor-pointer";

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("bugs.title")}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} bugs found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={exporting || total === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>{exporting ? "⏳" : "⬇️"}</span>
            Export CSV
          </button>
          {(user?.role === "ADMIN" || user?.role === "TESTER") && (
            <Link to="/bugs/new">
              <Button size="md">{t("bugs.reportBug")}</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="flex-1 min-w-52 relative">
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={t("bugs.searchPlaceholder")}
              className="w-full ps-8 pe-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className={sel} value={statusF}   onChange={(e) => { setStatusF(e.target.value);   setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIXED">Fixed</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select className={sel} value={priorityF} onChange={(e) => { setPriorityF(e.target.value); setPage(1); }}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select className={sel} value={severityF} onChange={(e) => { setSeverityF(e.target.value); setPage(1); }}>
            <option value="">All Severities</option>
            <option value="TRIVIAL">Trivial</option>
            <option value="MINOR">Minor</option>
            <option value="MAJOR">Major</option>
            <option value="CRITICAL">Critical</option>
            <option value="BLOCKER">Blocker</option>
          </select>

          <select className={sel} value={projectF}  onChange={(e) => { setProjectF(e.target.value);  setPage(1); }}>
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select className={sel} value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-lg transition-colors"
            >
              ✕ Clear All
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1 text-xs font-medium"
              >
                {chip.label}
                <button onClick={chip.clear} className="hover:text-rose-600 transition-colors">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {bugs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-slate-500 font-medium">{t("bugs.noBugsFound")}</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Title", "Project", "Priority", "Severity", "Status", "Assigned To", "Date"].map((h) => (
                      <th key={h} className="text-start px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider first:px-6">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bugs.map((bug) => (
                    <tr key={bug.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[bug.priority]}`} />
                          <Link
                            to={`/bugs/${bug.id}`}
                            className="font-medium text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 max-w-xs"
                          >
                            {bug.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded-md font-medium">
                          {bug.project.name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge label={bug.priority} className={priorityColor[bug.priority]} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${severityBadge[bug.severity] ?? ""}`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge label={bug.status.replace("_", " ")} className={statusColor[bug.status]} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-sm">
                        {bug.assignedTo?.name ?? <span className="text-slate-300 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(bug.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-slate-500">
                Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-slate-600 font-medium px-1">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
