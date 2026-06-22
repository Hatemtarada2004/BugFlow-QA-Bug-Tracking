import type { Priority, Status, Severity } from "../types";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const priorityColor: Record<Priority, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export const statusColor: Record<Status, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  FIXED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export const severityColor: Record<Severity, string> = {
  TRIVIAL: "bg-slate-100 text-slate-600",
  MINOR: "bg-green-100 text-green-700",
  MAJOR: "bg-yellow-100 text-yellow-800",
  CRITICAL: "bg-orange-100 text-orange-800",
  BLOCKER: "bg-red-100 text-red-800",
};

export const statusLabel: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  FIXED: "Fixed",
  CLOSED: "Closed",
};
