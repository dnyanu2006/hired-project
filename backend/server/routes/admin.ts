import { Router } from "express";
import { User } from "../models/User";
import { Job } from "../models/Job";
import { Application } from "../models/Application";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireRole(["admin"]));

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();
    res.json({ users, jobs, applications });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/users/:id/block", async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const apps = await Application.find().populate("userId", "name").populate("jobId", "title").populate("recruiterId", "name");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
