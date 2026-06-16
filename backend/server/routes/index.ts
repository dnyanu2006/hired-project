import { Router } from "express";
import authRoutes from "./auth.ts";
import jobRoutes from "./jobs.ts";
import applicationRoutes from "./applications.ts";
import adminRoutes from "./admin.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);

export default router;
