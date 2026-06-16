import { Router } from "express";
import { Application } from "../models/Application.ts";
import { Job } from "../models/Job.ts";
import { User } from "../models/User.ts";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.ts";
import { sendEmail } from "../utils/email.ts";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/*const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});*/
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage });

const router = Router();

// User: Apply to job
router.post("/", authenticate, requireRole(["user"]), upload.single("resume"), async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check existing
    const existing = await Application.findOne({ jobId, userId: req.user?.id });
    if (existing) return res.status(400).json({ error: "Already applied" });

    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const app = new Application({
      jobId,
      userId: req.user?.id,
      recruiterId: job.recruiterId,
      status: "pending",
      resumeUrl
    });
    await app.save();

    try {
      await app.populate("userId", "name email");
      const recruiter = await User.findById(job.recruiterId);
      const u = app.userId as any;
      if (recruiter && recruiter.email) {
        await sendEmail(
          recruiter.email,
          `New Application received for ${job.title}`,
          `<h3>New Applicant Alert</h3><p><b>${u.name}</b> (${u.email}) has applied for your job posting: <b>${job.title}</b>.</p><p>Please log in to your recruiter console to review their application.</p>`
        );
      }
    } catch (e) {
      console.error("Failed to send notification email", e);
    }

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// User: My applications
router.get("/me", authenticate, requireRole(["user"]), async (req: AuthRequest, res) => {
  try {
    const apps = await Application.find({ userId: req.user?.id }).populate("jobId");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Get applications for their jobs
router.get("/job/:jobId", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.recruiterId.toString() !== req.user?.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    const apps = await Application.find({ jobId: req.params.jobId }).populate("userId", "name email");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Recruiter: Update application status
router.put("/:id/status", authenticate, requireRole(["recruiter"]), async (req: AuthRequest, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    const app = await Application.findOne({ _id: req.params.id, recruiterId: req.user?.id }).populate("userId", "name email").populate("jobId", "title company");
    
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = status;
    await app.save();

    // Send email
    const u = app.userId as any;
    const j = app.jobId as any;
    const htmlBody =
  status === "accepted"
    ? `
      <div>
        <h2>🎉 Congratulations!</h2>
        <p>Hi ${u.name},</p>
        <p>Your application for the position of <b>${j.title}</b> at <b>${j.company}</b> has been <b style="color:green;">ACCEPTED</b>.</p>
        <p>You have been shortlisted. We will contact you soon with next steps.</p>
        <br/>
        <p>Best regards,<br/>Hiring Team</p>
      </div>
    `
    : `
      <div>
        <h2>Application Update</h2>
        <p>Hi ${u.name},</p>
        <p>Your application for <b>${j.title}</b> at <b>${j.company}</b> has been <b>${status}</b>.</p>
      </div>
    `;
    await sendEmail(u.email, `Application Status: ${status.toUpperCase()}`, htmlBody);

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
