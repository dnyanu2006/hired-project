import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { authenticate } from "../middleware/auth.ts";
import type { AuthRequest } from "../middleware/auth.ts";
import { sendEmail } from "../utils/email.ts";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.isBlocked) {
      return res.status(401).json({ error: "Invalid credentials or blocked account" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check for "first login of the day"
    const today = new Date();
today.setHours(0, 0, 0, 0);

if (!user.lastLoginDate || user.lastLoginDate < today) {
  try {
    await sendEmail(
      user.email,
      "Welcome to Job Portal Pro!",
      `<h3>Hello ${user.name},</h3>
       <p>Welcome back to Job Portal Pro! Check out the latest opportunities today.</p>`
    );
  } catch (err) {
    console.log("Email failed but ignored:", err);
  }
}
    user.lastLoginDate = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
