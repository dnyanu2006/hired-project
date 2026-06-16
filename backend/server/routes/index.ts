import { Router } from "express";
import authRoutes from "./auth";
import jobRoutes from "./jobs";
import applicationRoutes from "./applications";
import adminRoutes from "./admin";

const router = Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);

export default router;
