import { z } from "zod";
import { Priority, Status, Severity } from "@prisma/client";

export const createBugSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  projectId: z.string().min(1, "Project is required"),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  severity: z.nativeEnum(Severity).default(Severity.MAJOR),
  assignedToId: z.string().optional(),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  environment: z.string().optional(),
});

export const updateBugSchema = createBugSchema.partial().extend({
  status: z.nativeEnum(Status).optional(),
});

export type CreateBugInput = z.infer<typeof createBugSchema>;
export type UpdateBugInput = z.infer<typeof updateBugSchema>;
