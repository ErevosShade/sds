import "dotenv/config";
import express   from "express";
import cors      from "cors";
import { model } from "./gemini.js";
import roast     from "./routes/roast.js";
import dataorcap from "./routes/dataorcap.js";
import spotbug   from "./routes/spotbug.js";
import github    from "./routes/github.js";
import readme    from "./routes/readme.js";
import roadmap   from "./routes/roadmap.js";

const app  = express();
const PORT = process.env.PORT || 3001;

// Make model available to routes via app.locals
app.locals.model = model;

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://sds-psi.vercel.app",    // ← add this
    "https://sds.bitmesra.in",             // ← and this if you have a custom domain
  ]
}));
app.use(express.json({ limit: "50kb" }));

// ── Routes ────────────────────────────────────────────
app.use("/api/roast",     roast);
app.use("/api/dataorcap", dataorcap);
app.use("/api/spotbug",   spotbug);
app.use("/api/github",    github);
app.use("/api/readme",    readme);
app.use("/api/roadmap",   roadmap);
// Health check
app.get("/health", (_, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

// 404
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`🔥 SDS Chaos backend → http://localhost:${PORT}`));