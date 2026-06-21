import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { readFileSync } from "fs";

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to same-origin by default; override via CORS_ORIGIN env var
const allowedOrigin = process.env.CORS_ORIGIN || false;
app.use(cors({
  origin: allowedOrigin,
  credentials: false
}));

// Rate limiting
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use(defaultLimiter);

// Body parsing
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Load config once at startup
const config = JSON.parse(readFileSync("./public/site.config.json", "utf-8"));

// Static files
app.use(express.static("public"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Observe-only: repo health snapshot
app.get("/api/repos/health", (_req, res) => {
  res.json([]);
});

// Observe-only: system stats stub
app.get("/api/stats", (_req, res) => {
  res.json({
    healthy: 0,
    total: 0,
    prodReady: 0,
    inDev: 0,
    agentsActive: 0,
    missing: 0,
    noGit: 0,
    githubConnected: false
  });
});

// Hard-parked in safe-mode — routes exist but all writes/transactions are disabled
const SAFE_MODE = { success: false, disabled: true, message: "Disabled in safe-mode observe-only" };
app.post("/api/leads", (_req, res) => res.status(403).json(SAFE_MODE));
app.get("/api/leads", (_req, res) => res.status(403).json(SAFE_MODE));
app.post("/api/stripe/checkout", (_req, res) => res.status(403).json(SAFE_MODE));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ success: false, message: "Internal server error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`sfs-control-tower serving on port ${port}`));
export default app;
