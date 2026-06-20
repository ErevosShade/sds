import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Eye, Gamepad2, Bug, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const RoastMyCode     = lazy(() => import("../components/tools/RoastMyCode"));
const GitHubCinematic = lazy(() => import("../components/tools/GitHubCinematic"));
const DataOrCap       = lazy(() => import("../components/tools/DataOrCap"));
const SpotTheBug      = lazy(() => import("../components/tools/SpotTheBug"));

const TABS = [
  {
    id: "roast",  label: "Roast My Code",   emoji: "🔥",
    icon: Flame,    color: "#F97316", glow: "rgba(249,115,22,0.35)",
    tagline: "Paste code. Receive pain.",
    component: RoastMyCode,
  },
  {
    id: "github", label: "GitHub Cinematic", emoji: "👁",
    icon: Eye,      color: "#1A6FE8", glow: "rgba(26,111,232,0.35)",
    tagline: "Your dev story, visualized.",
    component: GitHubCinematic,
  },
  {
    id: "doc",    label: "Data or Cap",      emoji: "🎮",
    icon: Gamepad2, color: "#F5A623", glow: "rgba(245,166,35,0.35)",
    tagline: "True or false? You decide.",
    component: DataOrCap,
  },
  {
    id: "bug",    label: "Spot the Bug",     emoji: "🐛",
    icon: Bug,      color: "#22C55E", glow: "rgba(34,197,94,0.35)",
    tagline: "One snippet. One bug. Find it.",
    component: SpotTheBug,
  },
];

// 30 ambient particles
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  color: Math.random() > 0.5 ? "#1A6FE8" : "#F5A623",
  dur: 7 + Math.random() * 8,
  delay: Math.random() * 5,
  dx: (Math.random() - 0.5) * 24,
  dy: (Math.random() - 0.5) * 18,
}));

function ToolSkeleton() {
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: i === 1 ? "5rem" : "3.5rem",
          borderRadius: "1rem",
          background: "linear-gradient(90deg, #0D0D1A 25%, #141428 50%, #0D0D1A 75%)",
          backgroundSize: "600px 100%",
          animation: "shimmer 1.5s ease-in-out infinite",
        }} />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }`}</style>
    </div>
  );
}

export default function ChaosPage() {
  const [activeTab, setActiveTab] = useState("roast");
  const tab = TABS.find(t => t.id === activeTab);
  const ActiveComponent = tab?.component;

  return (
    <div style={{ background: "#050510", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* ── Ambient particles ── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {PARTICLES.map(p => (
          <motion.span key={p.id} className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
              background: p.color, opacity: 0.15,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}` }}
            animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [0.08, 0.22, 0.08] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        {/* Active-color radial glow */}
        <motion.div className="absolute inset-0"
          animate={{ background: `radial-gradient(ellipse 65% 45% at 25% 35%, ${tab?.color}0A 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 75% 65%, #1A6FE808 0%, transparent 60%)` }}
          transition={{ duration: 0.8 }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── Back to Home ── */}
        <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 20 }}>
          <Link to="/"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none",
              fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", color: "#404060",
              transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#A0A0C0"}
            onMouseLeave={e => e.currentTarget.style.color = "#404060"}>
            <ArrowLeft size={13} />
            Back to SDS
          </Link>
        </div>

        {/* ── Hero ── */}
        <div style={{ paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", position: "relative" }}>

          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
          }} />

          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.3rem 0.9rem", borderRadius: "9999px", marginBottom: "1.5rem",
                background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)" }}>
              <Sparkles size={12} style={{ color: "#F5A623" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                SDS Innovation Hub
              </span>
            </motion.div>

            {/* Glitch headline */}
            <div style={{ marginBottom: "0.5rem" }}>
              <motion.h1
                animate={{ x: [0, -2, 2, -1, 0], filter: ["brightness(1)", "brightness(1.4) hue-rotate(8deg)", "brightness(1)"] }}
                transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 900,
                  fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                  color: "#F0F0F8", letterSpacing: "-0.03em", lineHeight: 1,
                  display: "block", margin: 0 }}>
                Welcome to
              </motion.h1>
            </div>

            <div style={{ marginBottom: "1.5rem", position: "relative", display: "inline-block" }}>
              <motion.h1
                animate={{ x: [0, 2, -2, 1, 0], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5.5, delay: 0.3, ease: "easeInOut" }}
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 900,
                  fontSize: "clamp(3rem, 10vw, 8rem)",
                  letterSpacing: "-0.04em", lineHeight: 1,
                  background: "linear-gradient(135deg, #F5A623 0%, #F97316 35%, #9B6FE8 70%, #1A6FE8 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  margin: 0 }}>
                The Chaos
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              animate={{ textShadow: ["0 0 8px rgba(245,166,35,0.2)", "0 0 28px rgba(245,166,35,0.6)", "0 0 8px rgba(245,166,35,0.2)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                color: "#606080", letterSpacing: "0.06em", margin: 0 }}>
              Where Code Gets Real
            </motion.p>
          </motion.div>
        </div>

        {/* ── Tab Switcher ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1rem 2rem" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABS.map((t, i) => {
              const isActive = activeTab === t.id;
              const Icon = t.icon;
              return (
                <motion.button key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: "relative", cursor: "pointer", border: "none",
                    background: isActive ? `${t.color}12` : "rgba(255,255,255,0.03)",
                    borderRadius: "1.25rem", padding: "1.25rem 1rem",
                    outline: `1px solid ${isActive ? t.color + "50" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: isActive ? `0 0 32px ${t.glow}, 0 8px 24px rgba(0,0,0,0.4)` : "0 2px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.25s ease",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem",
                    overflow: "hidden",
                  }}>

                  {/* Top accent bar */}
                  {isActive && (
                    <motion.div layoutId="tab-bar"
                      style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
                  )}

                  {/* Icon container */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "0.75rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isActive ? `${t.color}20` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isActive ? t.color + "40" : "rgba(255,255,255,0.08)"}`,
                    transition: "all 0.25s",
                  }}>
                    <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{t.emoji}</span>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700,
                      fontSize: "0.8rem", color: isActive ? t.color : "#606080",
                      transition: "color 0.2s", lineHeight: 1.2 }}>
                      {t.label}
                    </div>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.65rem",
                      color: isActive ? t.color + "AA" : "#3A3A5A",
                      marginTop: "0.2rem", transition: "color 0.2s" }}>
                      {t.tagline}
                    </div>
                  </div>

                  {/* Active dot */}
                  {isActive && (
                    <motion.div layoutId="tab-dot"
                      style={{ width: 5, height: 5, borderRadius: "50%",
                        background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Tool Content ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1rem 6rem" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
              exit={{   opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

              {/* Tool card wrapper */}
              <div style={{
                borderRadius: "1.5rem", overflow: "hidden",
                background: "#0A0A18",
                border: `1px solid ${tab?.color}22`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.5), 0 0 80px ${tab?.color}08`,
              }}>
                {/* Tool header stripe */}
                <div style={{
                  padding: "0.6rem 1.5rem",
                  background: `linear-gradient(90deg, ${tab?.color}10, transparent)`,
                  borderBottom: `1px solid ${tab?.color}18`,
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: tab?.color,
                    boxShadow: `0 0 8px ${tab?.color}` }} />
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                    color: tab?.color, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8 }}>
                    {tab?.label}
                  </span>
                </div>

                <Suspense fallback={<ToolSkeleton />}>
                  {ActiveComponent && <ActiveComponent />}
                </Suspense>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
