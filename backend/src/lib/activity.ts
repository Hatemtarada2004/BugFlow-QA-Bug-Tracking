import { prisma } from "./prisma";

export const logActivity = (bugId: string, userId: string, action: string, detail?: string) =>
  prisma.activityLog.create({ data: { bugId, userId, action, detail } });
