import { Router } from "express";
import {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getDashboardStats,
  getActivityLogs,
} from "../controllers/bug.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/stats", getDashboardStats);
router.get("/", getBugs);
router.get("/:id/activity", getActivityLogs);
router.get("/:id", getBugById);
router.post("/", authorize("ADMIN", "TESTER"), createBug);
router.put("/:id", updateBug);
router.delete("/:id", deleteBug);

export default router;
