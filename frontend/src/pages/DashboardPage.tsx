import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import api from "../services/api";
import type { DashboardStats, Bug } from "../types";
import { Badge } from "../components/ui/Badge";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { priorityColor, statusColor, formatDate } from "../utils";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ─── Color Maps ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  "Open":        "#3b82f6",
  "In Progress": "#8b5cf6",
  "Fixed":       "#10b981",
  "Closed":      "#64748b",
};

const SEVERITY_COLORS: Record<string, string> = {
  TRIVIAL:  "#94a3b8",
  MINOR:    "#38bdf8",
  MAJOR:    "#fbbf24",
  CRITICAL: "#f97316",
  BLOCKER:  "#f43f5e",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW:      "#34d399",
  MEDIUM:   "#fbbf24",
  HIGH:     "#fb923c",
  CRITICAL: "#f43f5e",
};

const toTitle = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace("_", " ");

// ─── API Response Shape ───────────────────────────────────────────────────────

interface StatsResponse {
  stats: DashboardStats;
  byStatus:   { name: string; value: number }[];
  byPriority: { name: string; value: number }[];
  bySeverity: { name: string; value: number }[];
  byProject:  { name: string; bugs: number }[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  bg: string;
  text: string;
  border: string;
}

const StatCard = ({ label, value, icon, bg, text, border }: StatCardProps) => (
  <div className={`bg-white rounded-xl border ${border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-2xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className={`text-xs font-semibold ${text} uppercase tracking-wider mt-0.5`}>{label}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100">
      <h2 className="font-semibold text-slate-900 text-sm">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-0.5">{label}</p>
      <p className="text-indigo-600 font-bold">{payload[0].value} bugs</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-0.5">{payload[0].name}</p>
      <p className="text-indigo-600 font-bold">{payload[0].value} bugs</p>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-36 text-slate-300">
    <span className="text-3xl mb-1">📊</span>
    <span className="text-xs">No data yet</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const priorityDotColor: Record<string, string> = {
  LOW:      "bg-emerald-400",
  MEDIUM:   "bg-amber-400",
  HIGH:     "bg-orange-400",
  CRITICAL: "bg-rose-500",
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [data, setData]         = useState<StatsResponse | null>(null);
  const [recentBugs, setRecentBugs] = useState<Bug[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, bugsRes] = await Promise.all([
        api.get<StatsResponse>("/bugs/stats"),
        api.get<{ bugs: Bug[] }>("/bugs"),
      ]);
      setData(statsRes.data);
      setRecentBugs(bugsRes.data.bugs.slice(0, 6));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const { stats, byStatus, byPriority, bySeverity, byProject } = data!;

  const statCards: StatCardProps[] = [
    { label: t("dashboard.total"),        value: stats.total,        icon: "📋", bg: "bg-slate-100",   text: "text-slate-500",   border: "border-slate-200" },
    { label: t("dashboard.open"),         value: stats.open,         icon: "🔵", bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100" },
    { label: t("dashboard.inProgress"),   value: stats.inProgress,   icon: "🟣", bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100" },
    { label: t("dashboard.fixed"),        value: stats.fixed,        icon: "🟢", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    { label: t("dashboard.closed"),       value: stats.closed,       icon: "⚫", bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200" },
    { label: t("dashboard.assignedToMe"), value: stats.assignedToMe, icon: "👤", bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("dashboard.welcome")}, {user?.name} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString(i18n?.language === "ar" ? "ar-SA" : "en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Status Donut */}
        <ChartCard title="Bugs by Status">
          {byStatus.length === 0 ? <EmptyChart /> : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={byStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 leading-none">{stats.total}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Total</p>
                </div>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1">
                {byStatus.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[s.name] ?? "#94a3b8" }} />
                    <span className="text-xs text-slate-500 truncate">{s.name}</span>
                    <span className="text-xs font-bold text-slate-700 ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Severity Horizontal Bar */}
        <ChartCard title="Bugs by Severity">
          {bySeverity.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                layout="vertical"
                data={[...bySeverity].sort((a, b) => {
                  const order = ["BLOCKER","CRITICAL","MAJOR","MINOR","TRIVIAL"];
                  return order.indexOf(a.name) - order.indexOf(b.name);
                })}
                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={58}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={toTitle}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { name: string; value: number };
                    return (
                      <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-xs">
                        <p className="font-semibold text-slate-700 mb-0.5">{toTitle(d.name)}</p>
                        <p className="text-indigo-600 font-bold">{d.value} bugs</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {bySeverity.map((entry) => (
                    <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] ?? "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Priority Horizontal Bar */}
        <ChartCard title="Bugs by Priority">
          {byPriority.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                layout="vertical"
                data={[...byPriority].sort((a, b) => {
                  const order = ["CRITICAL","HIGH","MEDIUM","LOW"];
                  return order.indexOf(a.name) - order.indexOf(b.name);
                })}
                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={58}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={toTitle}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { name: string; value: number };
                    return (
                      <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-xs">
                        <p className="font-semibold text-slate-700 mb-0.5">{toTitle(d.name)}</p>
                        <p className="text-indigo-600 font-bold">{d.value} bugs</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {byPriority.map((entry) => (
                    <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] ?? "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent Bugs — 2/3 */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{t("dashboard.recentBugs")}</h2>
            <Link
              to="/bugs"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              {t("dashboard.viewAll")} →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBugs.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-slate-400 text-sm">{t("dashboard.noBugs")}</p>
              </div>
            )}
            {recentBugs.map((bug) => (
              <Link
                key={bug.id}
                to={`/bugs/${bug.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDotColor[bug.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {bug.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {bug.project.name} · {bug.createdBy.name} · {formatDate(bug.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge label={bug.priority} className={priorityColor[bug.priority]} />
                  <Badge label={bug.status.replace("_", " ")} className={statusColor[bug.status]} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bugs per Project — 1/3 */}
        <ChartCard title="Bugs per Project">
          {byProject.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={byProject}
                margin={{ top: 5, right: 10, bottom: 40, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="bugs" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>
    </div>
  );
};
