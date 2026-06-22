import { Router } from "express";
import { addComment, deleteComment } from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/:bugId", addComment);
router.delete("/:id", deleteComment);

export default router;
