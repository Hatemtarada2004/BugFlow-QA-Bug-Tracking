import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { Role } from "@prisma/client";

const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

const qs = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { createdBugs: true, assignedBugs: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  res.json({ users });
};

export const getDevelopers = async (_req: Request, res: Response): Promise<void> => {
  const developers = await prisma.user.findMany({
    where: { role: { in: [Role.DEVELOPER, Role.ADMIN] } },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
  res.json({ developers });
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;
  const result = updateRoleSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  if (id === req.user!.id) {
    res.status(400).json({ message: "You cannot change your own role" });
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: result.data.role },
    select: { id: true, name: true, email: true, role: true },
  });

  res.json({ user });
};
