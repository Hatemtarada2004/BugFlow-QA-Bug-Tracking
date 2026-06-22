import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { logActivity } from "../lib/activity";
import { sendBugAssignedEmail } from "../lib/mailer";
import { createBugSchema, updateBugSchema } from "../validators/bug.validator";
import { Role, Status, Priority, Severity } from "@prisma/client";

const bugInclude = {
  project: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
  _count: { select: { comments: true } },
};

const qs = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

export const getBugs = async (req: Request, res: Response): Promise<void> => {
  const status    = qs(req.query["status"]);
  const priority  = qs(req.query["priority"]);
  const severity  = qs(req.query["severity"]);
  const projectId = qs(req.query["projectId"]);
  const search    = qs(req.query["search"]);
  const sortOrder = (qs(req.query["sortOrder"]) ?? "desc") as "asc" | "desc";
  const page      = Math.max(1, parseInt(qs(req.query["page"])  ?? "1",   10));
  const limit     = Math.min(200, Math.max(1, parseInt(qs(req.query["limit"]) ?? "20", 10)));

  const where = {
    ...(status    && { status:    status    as Status }),
    ...(priority  && { priority:  priority  as Priority }),
    ...(severity  && { severity:  severity  as Severity }),
    ...(projectId && { projectId }),
    ...(search    && {
      OR: [
        { title:       { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [bugs, total] = await Promise.all([
    prisma.bug.findMany({
      where,
      include: bugInclude,
      orderBy: { createdAt: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.bug.count({ where }),
  ]);

  res.json({ bugs, total, page, limit });
};

export const getBugById = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const bug = await prisma.bug.findUnique({
    where: { id },
    include: {
      ...bugInclude,
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!bug) {
    res.status(404).json({ message: "Bug not found" });
    return;
  }

  res.json({ bug });
};

export const createBug = async (req: Request, res: Response): Promise<void> => {
  const result = createBugSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const project = await prisma.project.findUnique({ where: { id: result.data.projectId } });
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const bug = await prisma.bug.create({
    data: { ...result.data, createdById: req.user!.id },
    include: bugInclude,
  });

  await logActivity(bug.id, req.user!.id, "BUG_CREATED");

  res.status(201).json({ bug });
};

export const updateBug = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;
  const result = updateBugSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const existing = await prisma.bug.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Bug not found" });
    return;
  }

  const data = result.data;
  const logs: string[][] = [];

  if (data.status    && data.status    !== existing.status)   logs.push(["STATUS_CHANGED",   `${existing.status} → ${data.status}`]);
  if (data.priority  && data.priority  !== existing.priority) logs.push(["PRIORITY_CHANGED", `${existing.priority} → ${data.priority}`]);
  if (data.severity  && data.severity  !== existing.severity) logs.push(["SEVERITY_CHANGED", `${existing.severity} → ${data.severity}`]);
  if ("assignedToId" in data) {
    if (!data.assignedToId && existing.assignedToId) logs.push(["UNASSIGNED", undefined as unknown as string]);
    else if (data.assignedToId && data.assignedToId !== existing.assignedToId) logs.push(["ASSIGNED", data.assignedToId]);
  }

  if (req.user!.role === Role.DEVELOPER) {
    const { status, assignedToId } = data;
    const bug = await prisma.bug.update({
      where: { id },
      data: { ...(status && { status }), ...(assignedToId !== undefined && { assignedToId }) },
      include: bugInclude,
    });
    await Promise.all(logs.map(([action, detail]) => logActivity(id, req.user!.id, action, detail)));
    res.json({ bug });
    return;
  }

  const bug = await prisma.bug.update({
    where: { id },
    data,
    include: bugInclude,
  });

  await Promise.all(logs.map(([action, detail]) => logActivity(id, req.user!.id, action, detail)));

  // Email notification when bug is newly assigned
  if (data.assignedToId && data.assignedToId !== existing.assignedToId) {
    const assignee = await prisma.user.findUnique({ where: { id: data.assignedToId } });
    if (assignee) {
      sendBugAssignedEmail({
        to:        assignee.email,
        toName:    assignee.name,
        bugTitle:  bug.title,
        bugId:     bug.id,
        assignedBy: req.user!.name ?? "Someone",
      }).catch(() => { /* email is optional — never block the response */ });
    }
  }

  res.json({ bug });
};

export const deleteBug = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const existing = await prisma.bug.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Bug not found" });
    return;
  }

  if (req.user!.role !== Role.ADMIN && existing.createdById !== req.user!.id) {
    res.status(403).json({ message: "Not authorized to delete this bug" });
    return;
  }

  await prisma.bug.delete({ where: { id } });
  res.json({ message: "Bug deleted" });
};

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const logs = await prisma.activityLog.findMany({
    where: { bugId: id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  res.json({ logs });
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const [total, open, inProgress, fixed, closed, assignedToMe, byPriority, bySeverity, byProject] = await Promise.all([
    prisma.bug.count(),
    prisma.bug.count({ where: { status: "OPEN" } }),
    prisma.bug.count({ where: { status: "IN_PROGRESS" } }),
    prisma.bug.count({ where: { status: "FIXED" } }),
    prisma.bug.count({ where: { status: "CLOSED" } }),
    prisma.bug.count({ where: { assignedToId: userId } }),
    prisma.bug.groupBy({ by: ["priority"], _count: { priority: true } }),
    prisma.bug.groupBy({ by: ["severity"], _count: { severity: true } }),
    prisma.project.findMany({
      select: { name: true, _count: { select: { bugs: true } } },
      orderBy: { bugs: { _count: "desc" } },
      take: 7,
    }),
  ]);

  res.json({
    stats: { total, open, inProgress, fixed, closed, assignedToMe },
    byStatus: [
      { name: "Open",        value: open },
      { name: "In Progress", value: inProgress },
      { name: "Fixed",       value: fixed },
      { name: "Closed",      value: closed },
    ].filter((s) => s.value > 0),
    byPriority: byPriority.map((p) => ({ name: p.priority, value: p._count.priority })),
    bySeverity: bySeverity.map((s) => ({ name: s.severity, value: s._count.severity })),
    byProject: byProject.map((p) => ({ name: p.name, bugs: p._count.bugs })),
  });
};
