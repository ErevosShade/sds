import { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import sdsLogo from "../../assets/sds-logo.jpg";

// ─── Animated neural network SVG ─────────────────────────────────────────────
const NODES = [
  // Input layer
  { id: "i1", x: 80,  y: 80,  layer: 0 },
  { id: "i2", x: 80,  y: 180, layer: 0 },
  { id: "i3", x: 80,  y: 280, layer: 0 },
  { id: "i4", x: 80,  y: 380, layer: 0 },
  // Hidden layer 1
  { id: "h1", x: 230, y: 110, layer: 1 },
  { id: "h2", x: 230, y: 210, layer: 1 },
  { id: "h3", x: 230, y: 310, layer: 1 },
  // Hidden layer 2
  { id: "h4", x: 380, y: 140, layer: 2 },
  { id: "h5", x: 380, y: 240, layer: 2 },
  { id: "h6", x: 380, y: 340, layer: 2 },
  // Output
  { id: "o1", x: 520, y: 180, layer: 3 },
  { id: "o2", x: 520, y: 290, layer: 3 },
];

const EDGES = [
  // i → h1
  ["i1","h1"],["i1","h2"],["i1","h3"],
  ["i2","h1"],["i2","h2"],["i2","h3"],
  ["i3","h1"],["i3","h2"],["i3","h3"],
  ["i4","h2"],["i4","h3"],
  // h1 → h2
  ["h1","h4"],["h1","h5"],
  ["h2","h4"],["h2","h5"],["h2","h6"],
  ["h3","h5"],["h3","h6"],
  // h2 → o
  ["h4","o1"],["h4","o2"],
  ["h5","o1"],["h5","o2"],
  ["h6","o2"],
];

function NeuralNet() {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  const layerColors = ["#F5A623", "#1A6FE8", "#4D91F0", "#F5A623"];

  return (
    <svg
      viewBox="0 0 600 460"
      className="w-full h-full"
      style={{ opacity: 0.9 }}
    >
      <defs>
        {/* Pulse gradient for edges */}
        {EDGES.map(([a, b], i) => (
          <linearGradient key={i} id={`eg${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A6FE8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#4D91F0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1A6FE8" stopOpacity="0.15" />
          </linearGradient>
        ))}
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const A = nodeMap[a], B = nodeMap[b];
        const delay = (i * 0.18) % 3.5;
        return (
          <motion.line
            key={i}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke={`url(#eg${i})`}
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.1, 0.45, 0.1] }}
            transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}

      {/* Pulse dots travelling along edges */}
      {EDGES.filter((_, i) => i % 3 === 0).map(([a, b], i) => {
        const A = nodeMap[a], B = nodeMap[b];
        return (
          <motion.circle
            key={`pulse-${i}`}
            r={2.5}
            fill="#4D91F0"
            style={{ filter: "drop-shadow(0 0 4px #1A6FE8)" }}
            initial={{ cx: A.x, cy: A.y, opacity: 0 }}
            animate={{
              cx: [A.x, B.x],
              cy: [A.y, B.y],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.55,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.8,
            }}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const color = layerColors[node.layer];
        return (
          <g key={node.id}>
            {/* Glow ring */}
            <motion.circle
              cx={node.x} cy={node.y} r={14}
              fill="none"
              stroke={color}
              strokeWidth={1}
              initial={{ opacity: 0.1, scale: 0.8 }}
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.15, 0.8] }}
              transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
            {/* Core */}
            <motion.circle
              cx={node.x} cy={node.y} r={7}
              fill={color}
              fillOpacity={0.85}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${node.x}px ${node.y}px`, filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </g>
        );
      })}

      {/* Layer labels */}
      {[["Input", 80], ["Hidden", 230], ["Hidden", 380], ["Output", 520]].map(([label, x], i) => (
        <motion.text
          key={i} x={x} y={440}
          textAnchor="middle"
          fill="rgba(160,160,184,0.5)"
          fontSize={11}
          fontFamily="'DM Sans', sans-serif"
          letterSpacing={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + i * 0.1 }}
        >
          {label}
        </motion.text>
      ))}
    </svg>
  );
}

// ─── Floating data chips ──────────────────────────────────────────────────────
const CHIPS = [
  { label: "accuracy: 97.4%",  color: "#22C55E", delay: 0.6,  x: "5%",  y: "12%" },
  { label: "loss: 0.032",      color: "#1A6FE8", delay: 1.1,  x: "55%", y: "4%"  },
  { label: "epoch 48/50",      color: "#F5A623", delay: 1.6,  x: "2%",  y: "80%" },
  { label: "val_acc: 96.1%",   color: "#4D91F0", delay: 2.0,  x: "50%", y: "88%" },
];

// ─── Main component ───────────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};
const up = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#050510", minHeight: "100vh", paddingTop: 80 }}
    >
      {/* Subtle grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(26,111,232,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }}
      />

      {/* Inner container: split layout */}
      <div
        className="relative z-10 flex flex-col lg:flex-row items-center"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "4vh 2rem 6vh", minHeight: "calc(100vh - 80px)", gap: "2rem" }}
      >

        {/* ── LEFT: Text content ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left"
        >

          {/* Badge */}
          <motion.div variants={up}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", color: "#F5A623", letterSpacing: "0.12em" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} />
              Est. 2019 · BIT Mesra
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={up} style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
            <span className="block font-black" style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", color: "#F0F0F0" }}>
              Building the
            </span>
            <span className="block font-black" style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", color: "#F0F0F0" }}>
              next generation
            </span>
            <span className="block font-black" style={{
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              background: "linear-gradient(120deg, #4D91F0 0%, #1A6FE8 35%, #F5A623 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              of data scientists.
            </span>
          </motion.h1>

          {/* Body */}
          <motion.p variants={up} className="max-w-md mx-auto lg:mx-0 leading-relaxed"
            style={{ color: "#808098", fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem" }}>
            We run workshops, ship projects, crack hackathons, and connect students
            with the data-driven world — from first model to first placement.
          </motion.p>

          {/* Stats */}
          <motion.div variants={up} className="flex items-center gap-8 justify-center lg:justify-start">
            {[["200+","Members"],["30+","Events"],["50+","Projects"]].map(([v,l], i, arr) => (
              <div key={l} className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#F0F0F0" }}>{v}</span>
                  <span style={{ fontSize: "0.72rem", color: "#3A3A5A", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, transparent, #2A2A4A, transparent)" }} />}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={up} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <motion.a href="/tools"
              className="group relative inline-flex items-center justify-center gap-2 font-bold overflow-hidden rounded-full"
              style={{ background: "#1A6FE8", color: "#fff", padding: "0.8rem 1.75rem",
                boxShadow: "0 0 0 1px rgba(26,111,232,0.5), 0 4px 24px rgba(26,111,232,0.4)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore AI Tools
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #1A6FE8, #4D91F0, #F5A623)" }} />
            </motion.a>

            <motion.a href="#about"
              onClick={e => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
                color: "#808098", padding: "0.8rem 1.75rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}
              whileHover={{ scale: 1.04, y: -2, color: "#F0F0F0", borderColor: "rgba(26,111,232,0.4)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              About SDS
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Animated neural network ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="lg:w-1/2 relative"
          style={{ height: "clamp(320px, 45vh, 500px)" }}
        >
          {/* Glow behind network */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(26,111,232,0.07) 0%, transparent 70%)" }}
          />

          <NeuralNet />

          {/* Floating metric chips */}
          {CHIPS.map((chip, i) => (
            <motion.div
              key={i}
              className="absolute px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                left: chip.x, top: chip.y,
                background: `${chip.color}12`,
                border: `1px solid ${chip.color}30`,
                color: chip.color,
                fontFamily: "'JetBrains Mono', monospace",
                backdropFilter: "blur(8px)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -5, 0] }}
              transition={{
                opacity: { delay: chip.delay, duration: 0.5 },
                y: { delay: chip.delay, duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {chip.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, #050510, transparent)" }} />
    </section>
  );
}