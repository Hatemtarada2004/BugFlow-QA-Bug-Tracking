import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";
import { logActivity } from "../lib/activity";

const qs = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const uploadDir = path.join(__dirname, "../../uploads");

export const uploadAttachment = async (req: Request, res: Response): Promise<void> => {
  const bugId = qs(req.params["bugId"])!;
  const file  = req.file;

  if (!file) {
    res.status(400).json({ message: "No file uploaded or file type not allowed" });
    return;
  }

  const bug = await prisma.bug.findUnique({ where: { id: bugId } });
  if (!bug) {
    fs.unlinkSync(file.path);
    res.status(404).json({ message: "Bug not found" });
    return;
  }

  const attachment = await prisma.attachment.create({
    data: {
      filename:     file.filename,
      originalName: file.originalname,
      mimeType:     file.mimetype,
      size:         file.size,
      bugId,
      uploadedById: req.user!.id,
    },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });

  await logActivity(bugId, req.user!.id, "ATTACHMENT_ADDED", file.originalname);

  res.status(201).json({ attachment });
};

export const getAttachments = async (req: Request, res: Response): Promise<void> => {
  const bugId = qs(req.params["bugId"])!;

  const attachments = await prisma.attachment.findMany({
    where: { bugId },
    include: { uploadedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ attachments });
};

export const deleteAttachment = async (req: Request, res: Response): Promise<void> => {
  const id = qs(req.params["id"])!;

  const attachment = await prisma.attachment.findUnique({ where: { id } });
  if (!attachment) {
    res.status(404).json({ message: "Attachment not found" });
    return;
  }

  if (attachment.uploadedById !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  const filePath = path.join(uploadDir, attachment.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await prisma.attachment.delete({ where: { id } });
  res.json({ message: "Deleted" });
};
