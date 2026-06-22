import { Router } from "express";
import { getUsers, getDevelopers, updateUserRole } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN"), getUsers);
router.get("/developers", getDevelopers);
router.patch("/:id/role", authorize("ADMIN"), updateUserRole);

export default router;
