import { Router } from "express";
import { getProjects, getProjectById, createProject, deleteProject } from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("ADMIN", "TESTER"), createProject);
router.delete("/:id", authorize("ADMIN"), deleteProject);

export default router;
