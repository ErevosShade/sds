import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, ArrowRight, ArrowLeft, CheckCircle,
  ExternalLink, Copy, Check, BookOpen,
  Briefcase, Code2, Clock, Target, Zap,
  ChevronDown, ChevronUp, Star, AlertCircle,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const YEARS = [
  { id: "1st Year",      emoji: "🌱", desc: "Just started exploring"     },
  { id: "2nd Year",      emoji: "🔨", desc: "Building foundations"       },
  { id: "3rd Year",      emoji: "🎯", desc: "Placement-focused"          },
  { id: "4th Year",      emoji: "🚀", desc: "Final year, need it now"    },
  { id: "Working Pro",   emoji: "💼", desc: "Switching to data science"  },
];

const BACKGROUNDS = ["Computer Science", "Electronics (ECE)", "Mechanical", "Mathematics", "Physics", "Other"];

const SKILL_GROUPS = [
  { label: "Programming",  skills: ["Python", "R", "SQL", "JavaScript", "Scala", "Julia"]         },
  { label: "ML / AI",      skills: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning"] },
  { label: "Data Tools",   skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"]         },
  { label: "Frameworks",   skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Hugging Face", "LangChain"] },
  { label: "Engineering",  skills: ["Git", "Docker", "AWS", "GCP", "Azure", "Spark", "Airflow"]  },
  { label: "BI & Analytics",skills:["Tableau", "Power BI", "Excel", "Google Analytics", "Looker"] },
  { label: "Math & Stats", skills: ["Statistics", "Linear Algebra", "Probability", "Calculus"]    },
];

const ROLES = [
  { id: "ML Engineer",       emoji: "🤖", desc: "Build & deploy ML models at scale",         tag: "High demand"    },
  { id: "Data Scientist",    emoji: "📊", desc: "Research + modeling + business insights",    tag: "Most popular"   },
  { id: "Data Analyst",      emoji: "📈", desc: "Dashboards, metrics & business decisions",   tag: "Best entry point"},
  { id: "Data Engineer",     emoji: "🔧", desc: "Pipelines, warehouses & infrastructure",     tag: "Highest salary" },
  { id: "AI Researcher",     emoji: "🧬", desc: "Push the boundaries of AI research",         tag: "Hardest path"   },
  { id: "Business Analyst",  emoji: "💼", desc: "Data-driven strategy & product thinking",    tag: "Low barrier"    },
];

const TIMELINES = [
  { id: "1 month",   emoji: "⚡", desc: "Crash course mode"    },
  { id: "3 months",  emoji: "📅", desc: "Solid foundation"     },
  { id: "6 months",  emoji: "🗓",  desc: "Job-ready path"       },
  { id: "1 year",    emoji: "🏆", desc: "Expert-level mastery" },
];

const RESOURCE_COLORS = {
  YouTube:       "#EF4444",
  Course:        "#1A6FE8",
  Book:          "#F5A623",
  Documentation: "#22C55E",
  Platform:      "#9B59B6",
};

// ── Animated score ring ───────────────────────────────────────────────────────
function ScoreRing({ score, color = "#22C55E", size = 100, label }) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - fill }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: size * 0.22, color }}>
            {score}%
          </motion.span>
        </div>
      </div>
      {label && <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.7rem", color: "#606080" }}>{label}</span>}
    </div>
  );
}

// ── Phase card ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, index, isLast }) {
  const [open, setOpen] = useState(index === 0);
  const rc = RESOURCE_COLORS[phase.resource?.type] || "#4D91F0";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ display: "flex", gap: "1rem" }}>

      {/* Timeline line + node */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(34,197,94,0.15)", border: "2px solid #22C55E",
          boxShadow: "0 0 16px rgba(34,197,94,0.25)",
          fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.78rem", color: "#22C55E",
        }}>
          {index + 1}
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: 2, background: "linear-gradient(#22C55E30, transparent)", minHeight: 24, marginTop: 4 }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, marginBottom: isLast ? 0 : "0.75rem" }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer",
            padding: "0.9rem 1rem", borderRadius: "0.875rem",
            background: open ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
            outline: `1px solid ${open ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
            transition: "all 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#F0F0F0" }}>
                  {phase.focus}
                </span>
                <span style={{ padding: "0.15rem 0.55rem", borderRadius: "9999px",
                  fontFamily: "JetBrains Mono,monospace", fontSize: "0.6rem",
                  background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.25)" }}>
                  {phase.duration}
                </span>
              </div>
              <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", color: "#606080", marginTop: "0.2rem" }}>
                {phase.why}
              </p>
            </div>
            <div style={{ color: "#3A3A5A", flexShrink: 0 }}>
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}>
              <div style={{ padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.85rem",
                background: "rgba(255,255,255,0.015)", borderRadius: "0 0 0.875rem 0.875rem",
                marginTop: 2, outline: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Topics */}
                <div>
                  <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem", color: "#3A3A5A",
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Topics</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {phase.topics?.map(t => (
                      <span key={t} style={{ padding: "0.25rem 0.65rem", borderRadius: "9999px",
                        fontFamily: "DM Sans,sans-serif", fontSize: "0.75rem",
                        background: "rgba(26,111,232,0.12)", color: "#4D91F0",
                        border: "1px solid rgba(26,111,232,0.2)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resource */}
                {phase.resource && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem",
                    borderRadius: "0.6rem", background: `${rc}0C`, outline: `1px solid ${rc}25` }}>
                    <BookOpen size={13} style={{ color: rc, flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.6rem",
                        color: rc, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {phase.resource.type}
                      </span>
                      <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", color: "#E0E0E0", marginTop: "0.1rem" }}>
                        {phase.resource.name}
                      </div>
                    </div>
                    {phase.resource.url && (
                      <a href={phase.resource.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: rc, flexShrink: 0 }}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                )}

                {/* Project */}
                {phase.project && (
                  <div style={{ display: "flex", gap: "0.6rem", padding: "0.6rem 0.75rem",
                    borderRadius: "0.6rem", background: "rgba(245,166,35,0.06)", outline: "1px solid rgba(245,166,35,0.2)" }}>
                    <Code2 size={13} style={{ color: "#F5A623", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.6rem",
                        color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Build This
                      </span>
                      <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", color: "#C0A060",
                        marginTop: "0.1rem", lineHeight: 1.5 }}>
                        {phase.project}
                      </p>
                    </div>
                  </div>
                )}

                {/* Milestone */}
                {phase.milestone && (
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                    <CheckCircle size={13} style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem", color: "#86EFAC", lineHeight: 1.5 }}>
                      <strong>Milestone:</strong> {phase.milestone}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Cinematic loading ─────────────────────────────────────────────────────────
const LOAD_LINES = [
  "Analyzing your profile...",
  "Mapping learning dependencies...",
  "Identifying skill gaps...",
  "Building your roadmap...",
];

function RoadmapLoader() {
  const [li, setLi] = useState(0);
  useState(() => {
    const t = setInterval(() => setLi(i => Math.min(i + 1, LOAD_LINES.length - 1)), 900);
    return () => clearInterval(t);
  });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "4rem 2rem", gap: "1.5rem" }}>
      {/* Pulsing rings */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: `2px solid ${i % 2 === 0 ? "#22C55E" : "#1A6FE8"}` }}
            animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity, ease: "easeOut" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Map size={24} style={{ color: "#22C55E" }} />
        </div>
      </div>

      <motion.p key={li} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "Syne,sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F0F0F0" }}>
        {LOAD_LINES[li]}
      </motion.p>

      <div style={{ width: 200, height: 2, borderRadius: "9999px", overflow: "hidden",
        background: "rgba(255,255,255,0.06)" }}>
        <motion.div style={{ height: "100%", borderRadius: "9999px",
          background: "linear-gradient(90deg,#22C55E,#1A6FE8)" }}
          initial={{ width: "0%" }} animate={{ width: "100%" }}
          transition={{ duration: 3.6, ease: "easeInOut" }} />
      </div>
    </motion.div>
  );
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.75rem" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: "9999px", overflow: "hidden",
          background: "rgba(255,255,255,0.07)" }}>
          <motion.div style={{ height: "100%", background: "#22C55E", borderRadius: "9999px" }}
            initial={{ width: 0 }}
            animate={{ width: i <= step ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [step,        setStep]        = useState(0);   // 0-3 = form steps
  const [generating,  setGenerating]  = useState(false);
  const [roadmap,     setRoadmap]     = useState(null);
  const [error,       setError]       = useState(null);
  const [copied,      setCopied]      = useState(false);
  const outputRef = useRef(null);

  // Form state
  const [year,       setYear]       = useState(null);
  const [background, setBackground] = useState("Computer Science");
  const [skills,     setSkills]     = useState([]);
  const [targetRole, setTargetRole] = useState(null);
  const [timeline,   setTimeline]   = useState(null);
  const [goal,       setGoal]       = useState("");

  const toggleSkill = s => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const canProceed = [
    !!year,
    true,              // skills optional
    !!targetRole,
    !!timeline,
  ][step];

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setRoadmap(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, background, skills, targetRole, timeline, goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setRoadmap(data);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again!");
    } finally {
      setGenerating(false);
    }
  };

  const shareRoadmap = () => {
    if (!roadmap) return;
    const text = [
      `🎯 My DataPath — ${roadmap.title}`,
      `Target: ${targetRole} in ${timeline}`,
      `Current readiness: ${roadmap.readinessScore}% → ${roadmap.projectedScore}% projected`,
      "",
      roadmap.phases?.map((p, i) => `Phase ${i+1}: ${p.focus} (${p.duration})`).join("\n"),
      "",
      `Key advice: "${roadmap.keyAdvice}"`,
      "",
      `Build your own → sds.bitmesra.in/roadmap`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Styles ──
  const cardBase = { borderRadius: "0.875rem", border: "none", cursor: "pointer",
    fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", textAlign: "left",
    transition: "all 0.2s", padding: "0.85rem 1rem" };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem",
    border: "none", fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem",
    background: "#080812", color: "#E0E0E0", outline: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box", resize: "vertical", transition: "outline-color 0.2s" };

  const labelStyle = { fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#606080",
    textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.6rem" };

  const nextBtn = (label, onClick, disabled) => (
    <motion.button onClick={onClick} disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, boxShadow: "0 0 24px rgba(34,197,94,0.35)" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
        padding: "0.85rem", borderRadius: "0.875rem", border: "none", width: "100%",
        fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem",
        background: disabled ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#22C55E,#16A34A)",
        color: disabled ? "#3A3A5A" : "#fff", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(34,197,94,0.25)",
        transition: "all 0.3s" }}>
      {label} {!disabled && <ArrowRight size={16} />}
    </motion.button>
  );

  const backBtn = () => (
    <button onClick={() => setStep(s => s - 1)}
      style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.75rem 1rem",
        borderRadius: "0.875rem", border: "none", cursor: "pointer", marginBottom: "0.75rem",
        background: "rgba(255,255,255,0.04)", outline: "1px solid rgba(255,255,255,0.07)",
        color: "#606080", fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem" }}>
      <ArrowLeft size={13} /> Back
    </button>
  );

  return (
    <div style={{ background: "#050510", minHeight: "100vh", paddingTop: "5rem" }}>

      {/* Ambient bg */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(34,197,94,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(26,111,232,0.05) 0%, transparent 60%)" }} />
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto", padding: "0 1rem 6rem" }}>


        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.3rem 0.85rem", borderRadius: "9999px", marginBottom: "1rem",
            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <Map size={11} style={{ color: "#22C55E" }} />
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem",
              color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              DataPath by SDS
            </span>
          </div>

          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900,
            fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#F0F0F0",
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Build Your{" "}
            <span style={{ background: "linear-gradient(135deg,#22C55E,#1A6FE8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              DataPath
            </span>
          </h1>

          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "1rem", color: "#606080",
            marginTop: "0.75rem", lineHeight: 1.6 }}>
            Tell us where you are and where you want to go.
            Get a personalized, week-by-week data science roadmap — no guessing, no generic tutorials.
          </p>
        </motion.div>

        {/* ── Form card ── */}
        {!roadmap && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ borderRadius: "1.25rem", overflow: "hidden",
              background: "#0A0A18", border: "1px solid rgba(34,197,94,0.2)",
              boxShadow: "0 0 60px rgba(34,197,94,0.06), 0 24px 48px rgba(0,0,0,0.4)" }}>

            {/* Top accent */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#22C55E,#1A6FE8)" }} />

            <div style={{ padding: "1.75rem" }}>
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RoadmapLoader />
                  </motion.div>
                ) : (
                  <motion.div key={`step-${step}`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

                    <StepBar step={step} total={4} />

                    {/* ─ Step 0: Year + Background ─ */}
                    {step === 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                          <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem",
                            color: "#F0F0F0", margin: "0 0 0.25rem" }}>
                            Where are you right now?
                          </p>
                          <p style={labelStyle} style={{ color: "#606080", fontFamily: "DM Sans,sans-serif",
                            fontSize: "0.8rem", marginBottom: "1rem" }}>
                            Step 1 of 4
                          </p>
                        </div>

                        <div>
                          <label style={labelStyle}>Year / Level</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            {YEARS.map(y => (
                              <motion.button key={y.id} onClick={() => setYear(y.id)}
                                whileTap={{ scale: 0.96 }}
                                style={{ ...cardBase,
                                  background: year === y.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                                  outline: `1px solid ${year === y.id ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.07)"}`,
                                  boxShadow: year === y.id ? "0 0 16px rgba(34,197,94,0.12)" : "none" }}>
                                <div style={{ fontSize: "1.3rem", marginBottom: "0.2rem" }}>{y.emoji}</div>
                                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                                  color: year === y.id ? "#22C55E" : "#A0A0B8" }}>{y.id}</div>
                                <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.7rem",
                                  color: "#3A3A5A", marginTop: "0.1rem" }}>{y.desc}</div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Academic Background</label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {BACKGROUNDS.map(b => (
                              <motion.button key={b} onClick={() => setBackground(b)} whileTap={{ scale: 0.95 }}
                                style={{ padding: "0.4rem 0.8rem", borderRadius: "9999px", border: "none",
                                  cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem",
                                  transition: "all 0.15s",
                                  background: background === b ? "rgba(26,111,232,0.18)" : "rgba(255,255,255,0.04)",
                                  outline: `1px solid ${background === b ? "rgba(26,111,232,0.45)" : "rgba(255,255,255,0.08)"}`,
                                  color: background === b ? "#4D91F0" : "#606080" }}>
                                {b}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {nextBtn("Next — Skills", () => setStep(1), !canProceed)}
                      </div>
                    )}

                    {/* ─ Step 1: Skills ─ */}
                    {step === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {backBtn()}
                        <div>
                          <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem",
                            color: "#F0F0F0", margin: "0 0 0.2rem" }}>
                            What do you already know?
                          </p>
                          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem",
                            color: "#606080", marginBottom: "0.25rem" }}>
                            Step 2 of 4 — Skip if you're a complete beginner, that's fine too.
                          </p>
                          {skills.length > 0 && (
                            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem",
                              color: "#22C55E" }}>
                              {skills.length} selected
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem",
                          maxHeight: "380px", overflowY: "auto",
                          scrollbarWidth: "thin", scrollbarColor: "#2A2A3A transparent" }}>
                          {SKILL_GROUPS.map(g => (
                            <div key={g.label}>
                              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem",
                                color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.1em",
                                marginBottom: "0.4rem" }}>{g.label}</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                {g.skills.map(s => {
                                  const on = skills.includes(s);
                                  return (
                                    <motion.button key={s} whileTap={{ scale: 0.93 }}
                                      onClick={() => toggleSkill(s)}
                                      style={{ padding: "0.35rem 0.7rem", borderRadius: "9999px", border: "none",
                                        cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.75rem",
                                        transition: "all 0.15s",
                                        background: on ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                                        outline: `1px solid ${on ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.08)"}`,
                                        color: on ? "#22C55E" : "#606080" }}>
                                      {on ? "✓ " : ""}{s}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {nextBtn("Next — Target Role", () => setStep(2), false)}
                      </div>
                    )}

                    {/* ─ Step 2: Target Role ─ */}
                    {step === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {backBtn()}
                        <div>
                          <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem",
                            color: "#F0F0F0", margin: "0 0 0.2rem" }}>
                            Where do you want to go?
                          </p>
                          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem",
                            color: "#606080", marginBottom: "0" }}>
                            Step 3 of 4
                          </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          {ROLES.map(r => (
                            <motion.button key={r.id} onClick={() => setTargetRole(r.id)}
                              whileTap={{ scale: 0.96 }}
                              style={{ ...cardBase,
                                background: targetRole === r.id ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.03)",
                                outline: `1px solid ${targetRole === r.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
                                boxShadow: targetRole === r.id ? "0 0 20px rgba(34,197,94,0.1)" : "none" }}>
                              <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{r.emoji}</div>
                              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                                color: targetRole === r.id ? "#22C55E" : "#E0E0E0", lineHeight: 1.2 }}>
                                {r.id}
                              </div>
                              <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.68rem",
                                color: "#3A3A5A", marginTop: "0.2rem", lineHeight: 1.4 }}>
                                {r.desc}
                              </div>
                              <div style={{ marginTop: "0.4rem", display: "inline-block",
                                padding: "0.12rem 0.5rem", borderRadius: "9999px",
                                fontFamily: "JetBrains Mono,monospace", fontSize: "0.55rem",
                                background: targetRole === r.id ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                                color: targetRole === r.id ? "#22C55E" : "#3A3A5A" }}>
                                {r.tag}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {nextBtn("Next — Timeline", () => setStep(3), !canProceed)}
                      </div>
                    )}

                    {/* ─ Step 3: Timeline + Goal ─ */}
                    {step === 3 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {backBtn()}
                        <div>
                          <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem",
                            color: "#F0F0F0", margin: "0 0 0.2rem" }}>
                            How long do you have?
                          </p>
                          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem",
                            color: "#606080" }}>Step 4 of 4 — Almost done.</p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          {TIMELINES.map(t => (
                            <motion.button key={t.id} onClick={() => setTimeline(t.id)}
                              whileTap={{ scale: 0.96 }}
                              style={{ ...cardBase,
                                background: timeline === t.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                                outline: `1px solid ${timeline === t.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}` }}>
                              <div style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>{t.emoji}</div>
                              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem",
                                color: timeline === t.id ? "#22C55E" : "#E0E0E0" }}>{t.id}</div>
                              <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.7rem", color: "#3A3A5A" }}>
                                {t.desc}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        <div>
                          <label style={labelStyle}>Specific goal? (optional)</label>
                          <textarea value={goal} onChange={e => setGoal(e.target.value)}
                            rows={2} placeholder="e.g. I want to crack a data analyst role at Flipkart or Zomato before my final placements..."
                            style={inputStyle}
                            onFocus={e => e.target.style.outlineColor = "rgba(34,197,94,0.4)"}
                            onBlur={e => e.target.style.outlineColor = "rgba(255,255,255,0.08)"} />
                        </div>

                        {error && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
                            borderRadius: "0.75rem", background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5",
                            fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem" }}>
                            <AlertCircle size={14} />
                            {error}
                          </div>
                        )}

                        {nextBtn("Generate My Roadmap ✨", generate, !canProceed)}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Roadmap Output ── */}
        <AnimatePresence>
          {roadmap && (
            <motion.div ref={outputRef}
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* ─ Header card ─ */}
              <div style={{ borderRadius: "1.25rem", overflow: "hidden",
                background: "linear-gradient(135deg,#080F14,#0A120A)",
                border: "1px solid rgba(34,197,94,0.3)",
                boxShadow: "0 0 48px rgba(34,197,94,0.08)" }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#22C55E,#1A6FE8)" }} />
                <div style={{ padding: "1.5rem" }}>

                  {/* Title + summary */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "1rem" }}>
                    <Target size={18} style={{ color: "#22C55E", flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.25rem",
                        color: "#F0F0F0", margin: 0, lineHeight: 1.2 }}>{roadmap.title}</h2>
                      <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem",
                        color: "#808098", marginTop: "0.4rem", lineHeight: 1.6 }}>{roadmap.summary}</p>
                    </div>
                  </div>

                  {/* Score + meta */}
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "center",
                    padding: "1rem", borderRadius: "0.875rem",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    flexWrap: "wrap" }}>

                    <div style={{ display: "flex", gap: "1.5rem", flex: 1 }}>
                      <ScoreRing score={roadmap.readinessScore} color="#EF4444" size={88} label="Current" />
                      <div style={{ display: "flex", alignItems: "center", color: "#3A3A5A" }}>
                        <ArrowRight size={20} />
                      </div>
                      <ScoreRing score={roadmap.projectedScore} color="#22C55E" size={88} label="After roadmap" />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {[
                        { icon: <Clock size={13} />,    label: "Timeline",    val: timeline,                   color: "#4D91F0" },
                        { icon: <Zap size={13} />,      label: "Weekly hrs",  val: `${roadmap.weeklyHours}h/week`, color: "#F5A623" },
                        { icon: <Briefcase size={13} />,label: "Target role", val: targetRole,                 color: "#22C55E" },
                        { icon: <Star size={13} />,     label: "Salary range",val: roadmap.salaryRange || "—", color: "#9B59B6" },
                      ].map(m => (
                        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ color: m.color }}>{m.icon}</span>
                          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.6rem", color: "#3A3A5A", minWidth: 60 }}>{m.label}</span>
                          <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem", color: "#E0E0E0", fontWeight: 600 }}>{m.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key advice */}
                  {roadmap.keyAdvice && (
                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.85rem", padding: "0.75rem 1rem",
                      borderRadius: "0.75rem", background: "rgba(245,166,35,0.06)",
                      border: "1px solid rgba(245,166,35,0.2)" }}>
                      <Zap size={14} style={{ color: "#F5A623", flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.83rem",
                        color: "#C0A060", lineHeight: 1.55, margin: 0, fontStyle: "italic" }}>
                        "{roadmap.keyAdvice}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ─ Phase timeline ─ */}
              <div style={{ borderRadius: "1.25rem", padding: "1.5rem",
                background: "#0A0A18", border: "1px solid rgba(34,197,94,0.15)" }}>
                <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#22C55E",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                  📍 Your Learning Path
                </p>
                {roadmap.phases?.map((phase, i) => (
                  <PhaseCard key={i} phase={phase} index={i} isLast={i === roadmap.phases.length - 1} />
                ))}
              </div>

              {/* ─ Skill gaps ─ */}
              {roadmap.skillGaps?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ borderRadius: "1.25rem", padding: "1.25rem",
                    background: "#0A0A18", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#EF4444",
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                    ⚠ Skill Gaps to Close
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {roadmap.skillGaps.map(g => (
                      <span key={g} style={{ padding: "0.3rem 0.75rem", borderRadius: "9999px",
                        fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem",
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ─ Target companies ─ */}
              {roadmap.targetCompanies?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ borderRadius: "1.25rem", padding: "1.25rem",
                    background: "#0A0A18", border: "1px solid rgba(26,111,232,0.2)" }}>
                  <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#4D91F0",
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                    🏢 Target Companies
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {roadmap.targetCompanies.map(c => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.6rem",
                        padding: "0.6rem 0.8rem", borderRadius: "0.75rem",
                        background: c.readyNow ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${c.readyNow ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                          background: c.readyNow ? "#22C55E" : "#3A3A5A",
                          boxShadow: c.readyNow ? "0 0 6px rgba(34,197,94,0.5)" : "none" }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem",
                            color: "#F0F0F0" }}>{c.name}</div>
                          <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.68rem", color: "#606080" }}>
                            {c.role} · {c.readyNow ? "Ready now" : c.by}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.68rem", color: "#2A2A3A",
                    marginTop: "0.6rem" }}>
                    🟢 Green = apply now · Grey = apply after completing roadmap
                  </p>
                </motion.div>
              )}

              {/* ─ Actions ─ */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>

                <motion.button onClick={shareRoadmap}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    padding: "0.85rem", borderRadius: "0.875rem", border: "none", cursor: "pointer",
                    fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                    background: copied ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.10)",
                    outline: `1px solid ${copied ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.25)"}`,
                    color: "#22C55E", transition: "all 0.2s" }}>
                  {copied ? <><Check size={15} /> Copied to clipboard!</> : <><Copy size={15} /> Share My Roadmap</>}
                </motion.button>

                <motion.button onClick={() => { setRoadmap(null); setStep(0); }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, padding: "0.85rem", borderRadius: "0.875rem", border: "none", cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem",
                    background: "rgba(255,255,255,0.04)", outline: "1px solid rgba(255,255,255,0.08)", color: "#606080" }}>
                  ← Regenerate
                </motion.button>
              </motion.div>

              {/* Disclaimer */}
              <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.68rem",
                color: "#2A2A3A", textAlign: "center", lineHeight: 1.5 }}>
                Roadmap generated by AI. Resources and company names are suggestions — verify before applying.
                Built by SDS, BIT Mesra.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
