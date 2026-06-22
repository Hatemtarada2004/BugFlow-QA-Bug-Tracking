import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createProjectSchema } from "../validators/project.validator";

const qs = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  const projects = await prisma.project.findMany({
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { bugs: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ projects });
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      bugs: {
        select: { id: true, title: true, status: true, priority: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const project = await prisma.project.create({
    data: { ...result.data, createdById: req.user!.id },
    include: { createdBy: { select: { id: true, name: true } } },
  });

  res.status(201).json({ project });
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;
  await prisma.project.delete({ where: { id } });
  res.json({ message: "Project deleted" });
};
