import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "Data scientists are analytical experts who utilize their skills in both technology and social science to find trends and manage data. They use industry knowledge, contextual understanding, skepticism of existing assumptions – to uncover solutions to business challenges.",
    name: "Prof. S. Padhi",
    role: "Head, Department of Mathematics",
    tag: "Faculty Advisor",
    initials: "SP",
    color: "#1A6FE8",
  },
  {
    quote: "The expert at anything was once a beginner. We believe that the most valuable asset of a community are the people passionate about their field and willing to share their knowledge and experience with others - that are the true educators who help others grow!",
    name: "Dr. Kirti Avishek",
    role: "Assistant Professor, Civil and Evn Engineering",
    tag: "Faculty Advisor",
    initials: "KA",
    color: "#F5A623",
  },
  {
    quote: "Joining SDS was the turning point of my college life. My first ML project, my first hackathon win, my first industry connection — all happened through this community.",
    name: "Vaibhav Raj",
    role: "President, SDS · ML & Systems",
    tag: "SDS",
    initials: "VR",
    color: "#1A6FE8",
  },
  {
    quote: "SDS gave me a place to fail fast and learn faster. The workshops go way beyond the syllabus — this is where you learn what the industry actually uses.",
    name: "Himanshu Pravash",
    role: "Vice President, SDS · Data Engineering",
    tag: "SDS",
    initials: "HP",
    color: "#F5A623",
  },
  {
    quote: "Being part of Hack & Forge changed how I think about problem-solving. 24 hours, real data, real pressure. Nothing prepares you for industry better than that.",
    name: "Lakshay Mittal",
    role: "Director, Events & Outreach",
    tag: "SDS",
    initials: "LM",
    color: "#1A6FE8",
  },
];

const MARQUEE_ITEMS = [
  "Hack & Forge", "DSS'26", "Coder's Cup", "Render Replicas",
  "DataHack 3.0", "ML Workshops", "Kaggle Sprint", "Industry Talks",
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, filter: "blur(6px)", transition: { duration: 0.4 } }),
};

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const N = TESTIMONIALS.length;

  // Auto-advance every 5s — no manual controls
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex(i => (i + 1) % N);
    }, 5000);
    return () => clearInterval(t);
  }, [N]);

  const t = TESTIMONIALS[index];
  const num = String(index + 1).padStart(2, "0");

  return (
    <section id="testimonials" style={{ background: "#050510", overflow: "hidden" }}>

      {/* ── TOP: Event marquee strip ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          overflow: "hidden",
          padding: "0.75rem 0",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 flex-shrink-0"
            >
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: i % 8 < 4 ? "#1A3A5A" : "#2A1A00",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>

              <span
                style={{
                  color: "#1A1A2E",
                  fontSize: "0.45rem",
                }}
              >
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main testimonial area ── */}
      <div style={{ minHeight: "82vh", display: "flex", alignItems: "stretch", position: "relative" }}>

        {/* Vertical label + dash */}
        <div className="hidden lg:flex flex-col items-center flex-shrink-0 pt-12 pb-10"
          style={{ width: 52, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
            color: "#2A2A4A", letterSpacing: "0.22em", textTransform: "uppercase",
            writingMode: "vertical-rl", transform: "rotate(180deg)",
            userSelect: "none", marginBottom: "1.5rem",
          }}>
            Testimonials
          </span>
          <div style={{ width: 1, flex: 1, background: "linear-gradient(to bottom, rgba(26,111,232,0.35), rgba(26,111,232,0.05))" }} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem) 2.5rem", position: "relative" }}>

          {/* Ghost number */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.span
              key={`n-${index}`}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.7 } }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.35 } }}
              aria-hidden
              style={{
                position: "absolute", top: "50%", right: "3rem",
                transform: "translateY(-50%)",
                fontFamily: "Syne, sans-serif", fontWeight: 900,
                fontSize: "clamp(7rem, 20vw, 18rem)",
                color: "rgba(26,111,232,0.04)", lineHeight: 1,
                userSelect: "none", pointerEvents: "none", letterSpacing: "-0.06em",
              }}
            >
              {num}
            </motion.span>
          </AnimatePresence>

          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div key={`b-${index}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: t.color, fontWeight: 600 }}>{t.tag}</span>
            </motion.div>
          </AnimatePresence>

          {/* Quote — smaller font */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={`q-${index}`}
              custom={dir}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(1.15rem, 2vw, 1.75rem)",
                fontWeight: 700, color: "#E8E8E8",
                lineHeight: 1.4, maxWidth: 820,
                margin: 0, position: "relative", zIndex: 1,
              }}
            >
              "{t.quote}"
            </motion.blockquote>
          </AnimatePresence>

          {/* Person */}
          <AnimatePresence mode="wait">
            <motion.div key={`p-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 mt-8" style={{ position: "relative", zIndex: 1 }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
                style={{ background: t.color, fontFamily: "Syne, sans-serif", fontSize: "0.9rem", boxShadow: `0 0 20px ${t.color}50` }}>
                {t.initials}
              </div>
              <div style={{ width: 32, height: 1, background: t.color, opacity: 0.4 }} />
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#F0F0F0" }}>{t.name}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#606080", marginTop: 2 }}>{t.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot progress — bottom left, no arrows */}
          <div className="flex items-center gap-2 mt-10" style={{ position: "relative", zIndex: 1 }}>
            {TESTIMONIALS.map((item, i) => (
              <motion.div key={i}
                animate={{ width: i === index ? 24 : 6, background: i === index ? item.color : "rgba(255,255,255,0.12)" }}
                transition={{ duration: 0.3 }}
                style={{ height: 4, borderRadius: 999 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}