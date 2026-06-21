import { useState, Suspense, lazy, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { Flame, Eye, Gamepad2, Bug, Sparkles, Zap } from "lucide-react";
import Footer from "../components/layout/Footer";

// ── Lazy-load tool components ─────────────────────────────────────────────────
const RoastMyCode     = lazy(() => import("../components/tools/RoastMyCode"));
const GitHubCinematic = lazy(() => import("../components/tools/GitHubCinematic"));
const DataOrCap       = lazy(() => import("../components/tools/DataOrCap"));
const SpotTheBug      = lazy(() => import("../components/tools/SpotTheBug"));

// ── Tool definitions ─── mirroring EventsPage event data shape ────────────────
const TOOLS = [
  {
    id: "roast",  label: "Roast My Code",      emoji: "🔥",
    icon: Flame,    color: "#F97316", glow: "rgba(249,115,22,0.25)",
    type: "AI Review",
    tagline: "Paste code. Receive pain.",
    desc: "Get your code brutally roasted by AI. No mercy, only improvement.",
    tags: ["Gemini AI", "Code Quality", "Instant"],
    stats: [{ value: "10s", label: "Avg Roast" }, { value: "∞", label: "Pain Level" }, { value: "100%", label: "Honest" }],
    component: RoastMyCode,
  },
  {
    id: "github", label: "GitHub Cinematic",    emoji: "👁",
    icon: Eye,      color: "#1A6FE8", glow: "rgba(26,111,232,0.25)",
    type: "Visualization",
    tagline: "Your dev story, visualized.",
    desc: "Turn your GitHub profile into a cinematic data visualization with charts and a README generator.",
    tags: ["GitHub API", "Recharts", "README Gen"],
    stats: [{ value: "Live", label: "Data" }, { value: "Charts", label: "Format" }, { value: "Free", label: "Always" }],
    component: GitHubCinematic,
  },
  {
    id: "doc",    label: "Data or Cap",          emoji: "🎮",
    icon: Gamepad2, color: "#F5A623", glow: "rgba(245,166,35,0.25)",
    type: "Quiz Game",
    tagline: "True or false? You decide.",
    desc: "Test your data science knowledge. Facts or fiction — can you tell the difference?",
    tags: ["Data Science", "Trivia", "AI-Powered"],
    stats: [{ value: "10", label: "Questions" }, { value: "4", label: "Levels" }, { value: "AI", label: "Powered" }],
    component: DataOrCap,
  },
  {
    id: "bug",    label: "Spot the Bug",          emoji: "🐛",
    icon: Bug,      color: "#22C55E", glow: "rgba(34,197,94,0.25)",
    type: "Challenge",
    tagline: "One snippet. One bug. Find it.",
    desc: "Sharpen your debugging skills. Find the bug in AI-generated code before time runs out.",
    tags: ["Debugging", "Python / JS", "Timed"],
    stats: [{ value: "3", label: "Levels" }, { value: "Pts", label: "Scoring" }, { value: "AI", label: "Generated" }],
    component: SpotTheBug,
  },
];

// 18 ambient particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  color: Math.random() > 0.5 ? "#1A6FE8" : "#F5A623",
  dur: 7 + Math.random() * 8, delay: Math.random() * 5,
  dx: (Math.random() - 0.5) * 20, dy: (Math.random() - 0.5) * 15,
}));

// ── Skeleton loader ───────────────────────────────────────────────────────────
function ToolSkeleton() {
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: i === 1 ? "5rem" : "3.5rem", borderRadius: "1rem",
          background: "linear-gradient(90deg, #0D0D1A 25%, #141428 50%, #0D0D1A 75%)",
          backgroundSize: "600px 100%", animation: "shimmer 1.5s ease-in-out infinite",
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
    </div>
  );
}

// ── Featured Tool Card — mirrors EventsPage FeaturedCard exactly ──────────────
function FeaturedToolCard({ tool }) {
  const ActiveComponent = tool.component;
  return (
    <div
      className="relative rounded-3xl overflow-hidden group"
      style={{
        background: "#0D0D1A",
        border: `1px solid ${tool.color}30`,
        boxShadow: `0 8px 48px rgba(0,0,0,0.5), 0 0 60px ${tool.color}10`,
      }}
    >
      {/* Top accent line — same as EventsPage FeaturedCard */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}80, transparent)` }} />

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left visual panel ── same structure as EventsPage FeaturedCard left */}
        <div
          className="relative flex flex-col items-center justify-center p-8 md:p-12 gap-4"
          style={{
            background: `linear-gradient(135deg, ${tool.color}10 0%, #080810 100%)`,
            minHeight: 220,
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Ghost text */}
          <span aria-hidden style={{
            position: "absolute", fontFamily: "Syne, sans-serif", fontWeight: 900,
            fontSize: "clamp(4rem, 12vw, 8rem)", color: `${tool.color}06`, lineHeight: 1,
            letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none",
          }}>
            TOOL
          </span>

          {/* Emoji */}
          <motion.span
            key={tool.id + "-emoji"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 1, position: "relative", zIndex: 1, willChange: "transform" }}
          >
            {tool.emoji}
          </motion.span>

          {/* Type + Active badges — same pattern as EventsPage */}
          <div className="flex items-center gap-2 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}40`, letterSpacing: "0.1em" }}>
              {tool.type}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.28)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} />
              Active
            </span>
          </div>

          {/* Title + tagline */}
          <div className="text-center relative z-10 px-2">
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.8rem)",
              fontWeight: 900, color: "#F0F0F0", lineHeight: 1.1, marginBottom: "0.35rem",
            }}>
              {tool.label}
            </h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", color: tool.color }}>
              {tool.tagline}
            </p>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem",
            color: "#808098", lineHeight: 1.65,
            textAlign: "center", maxWidth: 280, position: "relative", zIndex: 1,
          }}>
            {tool.desc}
          </p>

          {/* Stats row — same as EventsPage FeaturedCard */}
          <div className="flex items-center gap-6 relative z-10 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", width: "100%", justifyContent: "center" }}>
            {tool.stats.map(s => (
              <div key={s.label} className="text-center">
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: tool.color }}>{s.value}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.58rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tags — same as EventsPage FeaturedCard */}
          <div className="flex flex-wrap gap-1.5 justify-center relative z-10">
            {tool.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg text-xs"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#A0A0B8" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: live tool component ── */}
        <div className="flex flex-col" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", minHeight: 380 }}>
          {/* Tool header stripe */}
          <div style={{
            padding: "0.55rem 1.4rem", flexShrink: 0,
            background: `linear-gradient(90deg, ${tool.color}0E, transparent)`,
            borderBottom: `1px solid ${tool.color}14`,
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: tool.color, boxShadow: `0 0 8px ${tool.color}` }} />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
              color: tool.color, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8,
            }}>
              {tool.label}
            </span>
          </div>
          <div className="flex-1">
            <Suspense fallback={<ToolSkeleton />}>
              <ActiveComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tool selector card — pixel-perfect match of EventsPage EventCard ──────────
function ToolSelectorCard({ tool, isActive, onClick, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div
        className="relative h-full rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
        style={{
          background: "#0D0D1A",
          border: `1px solid ${isActive ? tool.color + "35" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isActive
            ? `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${tool.color}15`
            : "0 2px 12px rgba(0,0,0,0.35)",
          transform: isActive ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform",
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.borderColor = `${tool.color}35`;
            e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${tool.color}12`;
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.35)";
          }
        }}
      >
        {/* Top accent line — always on when active, on hover when not */}
        <div
          className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}70, transparent)` }}
        />

        {/* Top row: emoji + type badge + active pill */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1.5rem" }}>{tool.emoji}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ color: tool.color, background: `${tool.color}15`, border: `1px solid ${tool.color}30` }}>
              {tool.type}
            </span>
          </div>
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.28)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} />
              Active
            </span>
          )}
        </div>

        {/* Title + tagline */}
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#F0F0F0", lineHeight: 1.2 }}>
            {tool.label}
          </h3>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: tool.color, marginTop: 2 }}>
            {tool.tagline}
          </p>
        </div>

        {/* Description — fills remaining space like EventCard */}
        <p className="flex-1" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem", color: "#808098", lineHeight: 1.6 }}>
          {tool.desc}
        </p>

        {/* Stats row — identical to EventCard */}
        <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {tool.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: tool.color }}>{s.value}</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.58rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tags row — identical to EventCard */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tool.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#606080" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ChaosPage() {
  const [activeTool, setActiveTool] = useState("roast");
  const shouldReduceMotion = useReducedMotion();
  const tool = TOOLS.find(t => t.id === activeTool);

  return (
    <div style={{ background: "#050510", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* ── Ambient background ── */}
      {!shouldReduceMotion && (
        <div aria-hidden className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {PARTICLES.map(p => (
            <motion.span key={p.id} className="absolute rounded-full"
              style={{
                left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
                background: p.color, opacity: 0.15, boxShadow: `0 0 ${p.size * 4}px ${p.color}`, willChange: "transform",
              }}
              animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [0.07, 0.20, 0.07] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          {/* Reactive colour glow behind active tool */}
          <motion.div className="absolute inset-0"
            animate={{ background: `radial-gradient(ellipse 60% 40% at 22% 30%, ${tool?.color}08 0%, transparent 60%), radial-gradient(ellipse 45% 35% at 78% 65%, #1A6FE806 0%, transparent 60%)` }}
            transition={{ duration: 0.9 }}
          />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.010) 3px, rgba(255,255,255,0.010) 4px)",
          }} />
        </div>
      )}

      {/* ── Page content ── */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── Hero ── */}
        <div className="text-center px-4" style={{ paddingTop: "6.5rem", paddingBottom: "2.5rem" }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.3rem 0.9rem", borderRadius: "9999px", marginBottom: "1.5rem",
                background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)" }}>
              <Sparkles size={12} style={{ color: "#F5A623" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                SDS Innovation Hub
              </span>
            </motion.div>

            <div style={{ marginBottom: "0.4rem" }}>
              <motion.h1
                animate={!shouldReduceMotion ? { x: [0,-2,2,-1,0], filter: ["brightness(1)","brightness(1.4) hue-rotate(8deg)","brightness(1)"] } : {}}
                transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 4.5 }}
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 900,
                  fontSize: "clamp(1.8rem, 5.5vw, 4rem)", color: "#F0F0F8",
                  letterSpacing: "-0.03em", lineHeight: 1, display: "block", margin: 0, willChange: "transform" }}>
                Welcome to
              </motion.h1>
            </div>
            <div style={{ marginBottom: "1rem", display: "inline-block" }}>
              <motion.h1
                animate={!shouldReduceMotion ? { x: [0,2,-2,1,0], filter: ["brightness(1)","brightness(1.5)","brightness(1)"] } : {}}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5.5, delay: 0.3 }}
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 900,
                  fontSize: "clamp(2.4rem, 9vw, 6.5rem)", letterSpacing: "-0.04em", lineHeight: 1,
                  background: "linear-gradient(135deg, #F5A623 0%, #F97316 35%, #9B6FE8 70%, #1A6FE8 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  margin: 0, willChange: "transform" }}>
                The Chaos
              </motion.h1>
            </div>
            <motion.p
              animate={!shouldReduceMotion ? { textShadow: ["0 0 8px rgba(245,166,35,0.2)","0 0 24px rgba(245,166,35,0.55)","0 0 8px rgba(245,166,35,0.2)"] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(0.82rem, 2vw, 0.98rem)", color: "#606080", letterSpacing: "0.06em", margin: 0 }}>
              Where Code Gets Real
            </motion.p>
          </motion.div>
        </div>

        {/* ── Main content ── */}
        <div className="px-4 md:px-6" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: "5rem" }}>

          {/* ── Featured tool card (big) ── */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTool}
                initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                exit={{   opacity: 0, y: -10, filter: "blur(3px)" }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                <FeaturedToolCard tool={tool} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Tool selector grid — matches EventsPage grid structure ── */}
          <div>
            <div className="flex items-center gap-2 mb-4" style={{ paddingLeft: "0.2rem" }}>
              <Zap size={11} style={{ color: "#F5A623" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
                color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                All Tools
              </span>
            </div>
            {/* Same grid as EventsPage: 1 col → 2 col → 4 col */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS.map((t, i) => (
                <ToolSelectorCard
                  key={t.id} tool={t}
                  isActive={activeTool === t.id}
                  onClick={() => setActiveTool(t.id)}
                  index={i}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}