import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { logActivity } from "../lib/activity";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

const qs = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

export const addComment = async (req: Request, res: Response): Promise<void> => {
  const bugId = qs(req.params["bugId"])!;
  const result = commentSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const bug = await prisma.bug.findUnique({ where: { id: bugId } });
  if (!bug) {
    res.status(404).json({ message: "Bug not found" });
    return;
  }

  const comment = await prisma.comment.create({
    data: { content: result.data.content, bugId, authorId: req.user!.id },
    include: { author: { select: { id: true, name: true } } },
  });

  await logActivity(bugId, req.user!.id, "COMMENT_ADDED");

  res.status(201).json({ comment });
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  if (comment.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ message: "Not authorized to delete this comment" });
    return;
  }

  await prisma.comment.delete({ where: { id } });
  res.json({ message: "Comment deleted" });
};
