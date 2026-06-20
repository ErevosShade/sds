import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
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

// Mini animated graph for card visual
function MiniGraph({ color, isActive }) {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.65, 0.9, 0.75];
  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ background: `${color}${isActive ? "90" : "40"}` }}
          animate={{ height: isActive ? `${h * 100}%` : `${h * 50}%` }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const N = CARDS.length;

  // Auto-rotate
  useEffect(() => {
    if (!isInView || paused) return;
    const t = setInterval(() => setActive(a => (a + 1) % N), 3200);
    return () => clearInterval(t);
  }, [isInView, paused, N]);

  const prev = () => { setPaused(true); setActive(a => (a - 1 + N) % N); };
  const next = () => { setPaused(true); setActive(a => (a + 1) % N); };

  // 3 visible cards: prev, active, next
  const getPos = (i) => {
    const rel = ((i - active) % N + N) % N;
    if (rel === 0) return "center";
    if (rel === 1 || rel === N - 1) return rel === 1 ? "right" : "left";
    return "hidden";
  };

  return (
    <section
      id="what-we-do"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: "#050510" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent)" }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", letterSpacing: "0.12em" }}>
            What we do
          </span>
          <h2 className="font-bold" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#F0F0F0" }}>
            Skills we build together
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative flex items-center justify-center"
          style={{ height: 380, perspective: "1200px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {CARDS.map((card, i) => {
            const pos = getPos(i);
            if (pos === "hidden") return null;
            const Icon = card.icon;
            const isCenter = pos === "center";
            const isRight  = pos === "right";

            return (
              <motion.div
                key={card.title}
                onClick={() => { setActive(i); setPaused(true); }}
                animate={{
                  x: isCenter ? 0 : isRight ? "62%" : "-62%",
                  scale: isCenter ? 1 : 0.78,
                  rotateY: isCenter ? 0 : isRight ? -22 : 22,
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 10 : 1,
                  filter: isCenter ? "blur(0px)" : "blur(1.5px)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute cursor-pointer"
                style={{
                  width: "clamp(280px, 38vw, 400px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "#0D0D1A",
                    border: `1px solid ${isCenter ? card.color + "45" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: isCenter ? `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${card.color}18` : "0 4px 20px rgba(0,0,0,0.4)",
                    transition: "border-color 0.4s, box-shadow 0.4s",
                  }}
                >
                  {/* Card top — visual area */}
                  <div className="relative p-5 pb-3"
                    style={{ background: isCenter ? `${card.color}08` : "transparent", borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                        <Icon size={22} style={{ color: card.color }} strokeWidth={1.7} />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: card.color, background: `${card.color}12`, border: `1px solid ${card.color}25` }}>
                        {card.tag}
                      </span>
                    </div>

                    {/* Mini bar chart */}
                    <MiniGraph color={card.color} isActive={isCenter} />
                  </div>

                  {/* Card bottom — text + code */}
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <h3 className="font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}>
                        {card.title}
                      </h3>
                      <p className="text-xs font-medium mt-0.5" style={{ color: card.color }}>
                        {card.subtitle}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#808098", fontFamily: "'DM Sans', sans-serif" }}>
                      {card.description}
                    </p>

                    {/* Code snippet — only on active */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <pre
                            className="text-xs leading-relaxed rounded-lg p-3 mt-1"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color: "#4D91F0",
                              background: "rgba(26,111,232,0.06)",
                              border: "1px solid rgba(26,111,232,0.15)",
                              borderLeft: `3px solid ${card.color}`,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all",
                            }}
                          >
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

        {/* Controls row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          {/* Prev */}
          <button onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#606080" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,111,232,0.4)"; e.currentTarget.style.color = "#1A6FE8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#606080"; }}
          >
            ‹
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {CARDS.map((card, i) => (
              <button key={i} onClick={() => { setActive(i); setPaused(true); }}>
                <motion.div
                  animate={{
                    width: active === i ? 24 : 6,
                    background: active === i ? card.color : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ height: 6, borderRadius: 999 }}
                />
              </button>
            ))}
          </div>

          {/* Next */}
          <button onClick={next}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#606080" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,111,232,0.4)"; e.currentTarget.style.color = "#1A6FE8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#606080"; }}
          >
            ›
          </button>
        </motion.div>
      </div>
    </section>
  );
}