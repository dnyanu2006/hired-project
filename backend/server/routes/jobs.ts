import { Router } from "express";
import { Job } from "../models/Job.ts";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.ts";

const router = Router();

// Public: Get all jobs (with search/filter)
router.get("/", async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const query: any = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;

    const jobs = await Job.find(query).populate("recruiterId", "name company").sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Public: Get job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Create job
router.post("/", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const job = new Job({ ...req.body, recruiterId: req.user?.id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Update job
router.put("/:id", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiterId: req.user?.id }, req.body, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found or unauthorized" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Delete job
router.delete("/:id", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user?.id });
    if (!job) return res.status(404).json({ error: "Job not found or unauthorized" });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Get my jobs
router.get("/me/managed", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user?.id }).sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
