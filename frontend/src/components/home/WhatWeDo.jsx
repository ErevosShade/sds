import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BarChart2, BrainCircuit, Code2, Database, GitBranch, LineChart } from "lucide-react";

const CARDS = [
  {
    icon: BrainCircuit,
    title: "Machine Learning",
    subtitle: "Model training & deployment",
    description: "Build, tune, and ship real ML models. From linear regression to transformers — we cover the full stack.",
    color: "#1A6FE8",
    tag: "Core skill",
    code: `model.fit(X_train, y_train)\naccuracy = model.score(X_test, y_test)\nprint(f"acc: {accuracy:.3f}")`,
  },
  {
    icon: BarChart2,
    title: "Data Analysis",
    subtitle: "EDA & storytelling with data",
    description: "Turn raw datasets into insights. Pandas, NumPy, and visualization libraries to find the signal in the noise.",
    color: "#F5A623",
    tag: "Foundation",
    code: `df.describe()\ncorr = df.corr()\nsns.heatmap(corr, annot=True)`,
  },
  {
    icon: BrainCircuit,
    title: "Deep Learning",
    subtitle: "Neural networks & beyond",
    description: "CNNs, RNNs, attention mechanisms. We run reading groups on papers and build implementations from scratch.",
    color: "#1A6FE8",
    tag: "Advanced",
    code: `model = Sequential([\n  Dense(128, activation='relu'),\n  Dropout(0.3),\n  Dense(10, 'softmax')\n])`,
  },
  {
    icon: Database,
    title: "Data Engineering",
    subtitle: "Pipelines & infrastructure",
    description: "ETL pipelines, SQL, cloud storage, and batch processing. The backbone of every real data project.",
    color: "#F5A623",
    tag: "Infrastructure",
    code: `pipeline = Pipeline([\n  ('scaler', StandardScaler()),\n  ('clf', RandomForest())\n])`,
  },
  {
    icon: Code2,
    title: "Hackathons",
    subtitle: "Compete & ship fast",
    description: "Monthly internal challenges and inter-college competitions. The fastest way to level up under pressure.",
    color: "#1A6FE8",
    tag: "Compete",
    code: `# 24hrs to solve it\nsubmission = predict(test_df)\nleaderboard.submit(submission)`,
  },
  {
    icon: LineChart,
    title: "Research",
    subtitle: "Read, replicate, publish",
    description: "Weekly paper reading sessions. We pick recent arXiv drops, dissect them, and try to replicate results.",
    color: "#F5A623",
    tag: "Deep work",
    code: `# Attention is All You Need\nQ, K, V = split(X)\nattn = softmax(Q @ K.T) @ V`,
  },
];

// ── Mini animated bar chart ───────────────────────────────────────────────────
function MiniGraph({ color, isActive }) {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.65, 0.9, 0.75];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          style={{
            flex: 1, borderRadius: 3,
            background: `${color}${isActive ? "90" : "35"}`,
            minWidth: 0,
          }}
          animate={{ height: isActive ? `${h * 100}%` : `${h * 40}%` }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

// ── Main carousel ─────────────────────────────────────────────────────────────
export default function WhatWeDo() {
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [dragging, setDragging] = useState(false);

  const ref       = useRef(null);
  const trackRef  = useRef(null);
  const dragStart = useRef(null);
  const dragDelta = useRef(0);
  const autoRef   = useRef(null);

  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const N = CARDS.length;

  // ── Auto-rotate ──────────────────────────────────────────────────────────
  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActive(a => (a + 1) % N);
    }, 3400);
  }, [N]);

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current);
  }, []);

  useEffect(() => {
    if (!isInView || paused) return;
    startAuto();
    return stopAuto;
  }, [isInView, paused, startAuto, stopAuto]);

  // ── Navigate ─────────────────────────────────────────────────────────────
  const go = useCallback((n) => {
    setPaused(true);
    stopAuto();
    setActive(((n % N) + N) % N);
  }, [N, stopAuto]);

  const prev = () => go(active - 1);
  const next = () => go(active + 1);

  // ── Mouse drag ───────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
    dragDelta.current = 0;
    setDragging(false);
    stopAuto();
    setPaused(true);
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (dragStart.current === null) return;
    dragDelta.current = e.clientX - dragStart.current;
    if (Math.abs(dragDelta.current) > 8) setDragging(true);
  };

  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 48) {
      delta < 0 ? next() : prev();
    }
    dragStart.current = null;
    dragDelta.current = 0;
    setTimeout(() => setDragging(false), 100);
  };

  // ── Card position logic ───────────────────────────────────────────────────
  // Returns: "center" | "right" | "left" | "farRight" | "farLeft" | "hidden"
  const getPos = (i) => {
    const rel = ((i - active) % N + N) % N;
    if (rel === 0)           return "center";
    if (rel === 1)           return "right";
    if (rel === N - 1)       return "left";
    if (rel === 2)           return "farRight";
    if (rel === N - 2)       return "farLeft";
    return "hidden";
  };

  const VARIANTS = {
    center:   { x: "0%",    scale: 1,    rotateY: 0,   opacity: 1,    zIndex: 10, filter: "blur(0px)"   },
    right:    { x: "58%",   scale: 0.80, rotateY: -22, opacity: 0.55, zIndex: 5,  filter: "blur(1px)"   },
    left:     { x: "-58%",  scale: 0.80, rotateY:  22, opacity: 0.55, zIndex: 5,  filter: "blur(1px)"   },
    farRight: { x: "105%",  scale: 0.65, rotateY: -35, opacity: 0.15, zIndex: 1,  filter: "blur(2px)"   },
    farLeft:  { x: "-105%", scale: 0.65, rotateY:  35, opacity: 0.15, zIndex: 1,  filter: "blur(2px)"   },
    hidden:   { x: "0%",    scale: 0.5,  rotateY: 0,   opacity: 0,    zIndex: 0,  filter: "blur(4px)"   },
  };

  return (
    <section
      id="what-we-do"
      ref={ref}
      style={{ position: "relative", padding: "6rem 0", overflow: "hidden", background: "#050510" }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "9999px",
            color: "#F5A623", background: "rgba(245,166,35,0.08)",
            border: "1px solid rgba(245,166,35,0.22)", marginBottom: "1rem",
          }}>
            What we do
          </span>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#F0F0F0", margin: 0,
          }}>
            Skills we build together
          </h2>
          {/* Drag hint */}
          <motion.p
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
              color: "#3A3A5A", marginTop: "0.5rem", letterSpacing: "0.06em" }}>
            drag to explore ←→
          </motion.p>
        </motion.div>

        {/* ── Carousel Track ── */}
        <motion.div
          ref={trackRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onMouseEnter={() => { stopAuto(); setPaused(true); }}
          onMouseLeave={() => { if (!paused) startAuto(); }}
          style={{
            position: "relative",
            height: 400,
            perspective: "1400px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {CARDS.map((card, i) => {
            const pos = getPos(i);
            if (pos === "hidden") return null;

            const Icon     = card.icon;
            const isCenter = pos === "center";
            const v        = VARIANTS[pos];

            return (
              <motion.div
                key={card.title}
                onClick={() => { if (!dragging) go(i); }}
                animate={v}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 36,
                  mass: 0.9,
                }}
                style={{
                  position: "absolute",
                  width: "clamp(270px, 36vw, 390px)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
              >
                <div style={{
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  background: "#0D0D1A",
                  border: `1px solid ${isCenter ? card.color + "50" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: isCenter
                    ? `0 24px 60px rgba(0,0,0,0.65), 0 0 48px ${card.color}18`
                    : "0 4px 20px rgba(0,0,0,0.4)",
                  transition: "border-color 0.4s, box-shadow 0.4s",
                }}>

                  {/* Card top */}
                  <div style={{
                    padding: "1.25rem", paddingBottom: "0.75rem",
                    background: isCenter ? `${card.color}08` : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "0.75rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${card.color}15`, border: `1px solid ${card.color}30`, flexShrink: 0,
                      }}>
                        <Icon size={22} style={{ color: card.color }} strokeWidth={1.7} />
                      </div>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700,
                        padding: "0.25rem 0.65rem", borderRadius: "9999px",
                        color: card.color, background: `${card.color}12`,
                        border: `1px solid ${card.color}25`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {card.tag}
                      </span>
                    </div>
                    <MiniGraph color={card.color} isActive={isCenter} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <h3 style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: 800,
                        fontSize: "1.05rem", color: "#F0F0F0", margin: 0,
                      }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: card.color, marginTop: "0.2rem", fontFamily: "'DM Sans', sans-serif" }}>
                        {card.subtitle}
                      </p>
                    </div>
                    <p style={{
                      fontSize: "0.83rem", lineHeight: 1.65, color: "#808098",
                      fontFamily: "'DM Sans', sans-serif", margin: 0,
                    }}>
                      {card.description}
                    </p>

                    {/* Code snippet — only on active card */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <pre style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem", lineHeight: 1.7,
                            color: "#4D91F0",
                            background: "rgba(26,111,232,0.06)",
                            border: "1px solid rgba(26,111,232,0.15)",
                            borderLeft: `3px solid ${card.color}`,
                            borderRadius: "0.5rem",
                            padding: "0.75rem",
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                          }}>
                            {card.code}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginTop: "2rem" }}
        >
          {/* Prev */}
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
              color: "#606080", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,111,232,0.4)"; e.currentTarget.style.color = "#4D91F0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#606080"; }}
          >
            ‹
          </motion.button>

          {/* Dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {CARDS.map((card, i) => (
              <motion.button
                key={i}
                onClick={() => go(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.85 }}
                style={{ border: "none", cursor: "pointer", padding: 0, background: "transparent" }}
              >
                <motion.div
                  animate={{
                    width: active === i ? 24 : 7,
                    height: 7,
                    borderRadius: 9999,
                    background: active === i ? card.color : "rgba(255,255,255,0.14)",
                    boxShadow: active === i ? `0 0 8px ${card.color}80` : "none",
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.button>
            ))}
          </div>

          {/* Next */}
          <motion.button
            onClick={next}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
              color: "#606080", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,111,232,0.4)"; e.currentTarget.style.color = "#4D91F0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#606080"; }}
          >
            ›
          </motion.button>
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.58rem", color: "#2A2A3A", marginTop: "0.75rem", letterSpacing: "0.08em" }}>
          click · drag · or use arrow keys
        </motion.p>

      </div>
    </section>
  );
}