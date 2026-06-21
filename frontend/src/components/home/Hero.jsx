import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import sdsLogo from "../../assets/sds-logo.png";

// ─── Full-screen drifting node network ────────────────────────────────────────
const RAW_NODES = [
  { x: 6,  y: 12 }, { x: 18, y: 5  }, { x: 32, y: 18 }, { x: 48, y: 8  },
  { x: 62, y: 22 }, { x: 78, y: 10 }, { x: 90, y: 18 }, { x: 95, y: 35 },
  { x: 88, y: 55 }, { x: 92, y: 72 }, { x: 82, y: 85 }, { x: 68, y: 90 },
  { x: 52, y: 92 }, { x: 35, y: 88 }, { x: 18, y: 82 }, { x: 6,  y: 68 },
  { x: 4,  y: 48 }, { x: 8,  y: 30 }, { x: 28, y: 45 }, { x: 48, y: 52 },
  { x: 68, y: 48 }, { x: 75, y: 68 }, { x: 55, y: 72 }, { x: 38, y: 62 },
];

const EDGES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],
  [11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,0],
  [17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,18],
  [2,18],[4,19],[6,20],[8,21],[11,22],[13,23],[16,17],
  [1,17],[3,18],[5,19],[9,21],[12,22],
];

function NetworkBackground() {
  const nodes = useMemo(() =>
    RAW_NODES.map((n, i) => ({
      ...n,
      id: i,
      r: Math.random() * 3 + 2,
      color: Math.random() > 0.35 ? "#1A6FE8" : "#F5A623",
      driftX: (Math.random() - 0.5) * 2.5,
      driftY: (Math.random() - 0.5) * 2.5,
      dur: 8 + Math.random() * 6,
      delay: Math.random() * 4,
    })), []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const A = nodes[a], B = nodes[b];
        return (
          <motion.line
            key={i}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke="#1A6FE8"
            strokeWidth={0.08}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.06, 0.2, 0.06] }}
            transition={{ duration: 4 + (i % 5), delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}

      {/* Pulse dots on edges */}
      {EDGES.filter((_, i) => i % 4 === 0).map(([a, b], i) => {
        const A = nodes[a], B = nodes[b];
        return (
          <motion.circle
            key={`p${i}`}
            r={0.35}
            fill="#4D91F0"
            style={{ filter: "drop-shadow(0 0 0.8px #1A6FE8)" }}
            animate={{ cx: [A.x, B.x, A.x], cy: [A.y, B.y, A.y], opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.5, delay: i * 0.7, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => (
        <motion.circle
          key={n.id}
          r={n.r * 0.1}
          fill={n.color}
          style={{ filter: `drop-shadow(0 0 ${n.r * 0.3}px ${n.color})` }}
          animate={{
            cx: [n.x, n.x + n.driftX, n.x - n.driftX * 0.5, n.x],
            cy: [n.y, n.y + n.driftY, n.y - n.driftY * 0.5, n.y],
            opacity: [0.5, 0.9, 0.6, 0.5],
          }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
const WORDS = ["Data Scientists.", "ML Engineers.", "Researchers.", "Problem Solvers.", "Innovators."];

function useTypewriter() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pause | deleting

  useEffect(() => {
    const word = WORDS[index];
    let timeout;
    if (phase === "typing") {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("deleting"), 200);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 35);
      } else {
        setIndex(i => (i + 1) % WORDS.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, index]);

  return { displayed, color: index % 2 === 0 ? "#4D91F0" : "#F5A623" };
}

// ─── Floating metric card ─────────────────────────────────────────────────────
function MetricCard({ label, value, color, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5, type: "spring" },
        y:       { delay, duration: 4 + delay, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{
        ...style,
        background: "rgba(13,13,26,0.85)",
        border: `1px solid ${color}35`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${color}15`,
      }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <div className="flex flex-col leading-tight">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: color }}>{value}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#606080", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { displayed, color: typeColor } = useTypewriter();

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ background: "#050510", minHeight: "100vh", paddingTop: 80 }}
    >
      {/* Full-screen network */}
      <div className="absolute inset-0" style={{ opacity: 0.65 }}>
        <NetworkBackground />
      </div>

      {/* Dark vignette so center text pops */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(5,5,16,0.55) 0%, rgba(5,5,16,0.92) 100%)" }}
      />

      {/* Floating metric cards */}
      <MetricCard label="Accuracy"    value="97.4%"   color="#22C55E" delay={1.2} style={{ top: "22%", left: "6%"  }} />
      <MetricCard label="Model loss"  value="0.032"   color="#1A6FE8" delay={1.6} style={{ top: "18%", right: "8%" }} />
      <MetricCard label="Epoch"       value="48 / 50" color="#F5A623" delay={2.0} style={{ bottom: "28%", left: "5%" }} />
      <MetricCard label="Val acc"     value="96.1%"   color="#4D91F0" delay={2.4} style={{ bottom: "24%", right: "7%"}} />

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center" style={{ paddingBottom: "5vh" }}>

        {/* Logo + badge row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <img src={sdsLogo} alt="SDS" className="w-8 h-8 object-contain rounded-lg"
            style={{ border: "1px solid rgba(26,111,232,0.3)", padding: 4, background: "#0D0D1A" }} />
          <span style={{ color: "#606080", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>
            Society for Data Science · BIT Mesra
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-1 mb-6"
        >
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
            color: "#606080",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            The Official Club for
          </span>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 900,
            color: "#F0F0F0",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}>
            Aspiring{" "}
            <span style={{ color: typeColor, transition: "color 0.3s" }}>
              {displayed}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: typeColor }}
              >|</motion.span>
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "#808098",
            maxWidth: 480,
            lineHeight: 1.65,
            marginTop: "0.75rem",
          }}>
            We run workshops, ship real ML projects, crack hackathons, and connect
            students with the data-driven industry — from first model to first placement.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-12"
        >
          <motion.a href="/tools"
            className="group relative inline-flex items-center gap-2 font-semibold overflow-hidden rounded-full"
            style={{
              background: "#1A6FE8",
              color: "#fff",
              padding: "0.75rem 1.75rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              boxShadow: "0 0 0 1px rgba(26,111,232,0.5), 0 4px 24px rgba(26,111,232,0.4)",
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={14} />
              Explore AI Tools
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
              style={{ background: "linear-gradient(135deg, #1A6FE8, #4D91F0 50%, #F5A623)" }} />
          </motion.a>

          <motion.a href="#about"
            onClick={e => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 rounded-full font-semibold"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#808098",
              padding: "0.75rem 1.75rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
            }}
            whileHover={{ scale: 1.05, y: -2, color: "#F0F0F0", borderColor: "rgba(26,111,232,0.4)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            About SDS
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center gap-5 sm:gap-10"
        >
          {[["200+","Members"],["30+","Events"],["50+","Projects"]].map(([v, l], i, arr) => (
            <div key={l} className="flex items-center gap-5 sm:gap-10">
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.1rem, 4vw, 1.6rem)", fontWeight: 800, color: "#F0F0F0" }}>{v}</span>
                <span style={{ fontSize: "0.68rem", color: "#3A3A5A", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-7" style={{ background: "linear-gradient(to bottom, transparent, #2A2A4A, transparent)" }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, #050510, transparent)" }} />
    </section>
  );
}