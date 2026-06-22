export type Role = "ADMIN" | "TESTER" | "DEVELOPER";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Status = "OPEN" | "IN_PROGRESS" | "FIXED" | "CLOSED";
export type Severity = "TRIVIAL" | "MINOR" | "MAJOR" | "CRITICAL" | "BLOCKER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: { id: string; name: string };
  createdAt: string;
  _count?: { bugs: number };
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  severity: Severity;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  environment?: string;
  project: { id: string; name: string };
  createdBy: { id: string; name: string };
  assignedTo?: { id: string; name: string } | null;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
  _count?: { comments: number };
}

export interface Comment {
  id: string;
  content: string;
  author: { id: string; name: string };
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  fixed: number;
  closed: number;
  assignedToMe: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  detail?: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploadedBy: { id: string; name: string };
}
