import { Router } from "express";
import { uploadAttachment, getAttachments, deleteAttachment } from "../controllers/attachment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../lib/upload";

const router = Router();

router.use(authenticate);

router.get("/:bugId",    getAttachments);
router.post("/:bugId",   upload.single("file"), uploadAttachment);
router.delete("/:id",    deleteAttachment);

export default router;
