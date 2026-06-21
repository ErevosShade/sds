import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Zap, Users, Target, BookOpen, ArrowRight } from "lucide-react";

import Footer from "../components/layout/Footer";

const PILLARS = [
  { icon: Zap,      title: "Build fast",   desc: "Hackathons, sprints, and project challenges that force you to ship under pressure.", color: "#F5A623" },
  { icon: BookOpen, title: "Learn deep",   desc: "Workshops and paper reading groups that go beyond the syllabus into real ML.", color: "#1A6FE8" },
  { icon: Users,    title: "Grow together", desc: "A community of 200+ students who share resources, opportunities, and referrals.", color: "#4D91F0" },
  { icon: Target,   title: "Get placed",   desc: "Industry speaker sessions, mock interviews, and alumni networks that get you hired.", color: "#F5A623" },
];

const TIMELINE = [
  { year: "2019", event: "SDS Founded",              desc: "Started as a small study group of 12 students passionate about data science.",  color: "#1A6FE8" },
  { year: "2021", event: "First Hackathon",          desc: "Ran our first 12-hour internal hackathon. 40 participants, 10 projects shipped.", color: "#F5A623" },
  { year: "2023", event: "DSS Conference",           desc: "Hosted our first Data Science Summit with 3 industry speakers and 150+ attendees.", color: "#1A6FE8" },
  { year: "2024", event: "AI Tool Hub Launched",     desc: "Built and deployed an AI-powered tool suite used by students across campus.", color: "#F5A623" },
  { year: "2025", event: "DSS'26 & 200+ Members",   desc: "Hack & Forge, Speaker sessions, Coder's Cup — our biggest year yet.", color: "#1A6FE8" },
];

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;

  const dot = (
    <motion.div
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      className="relative flex-shrink-0 w-5 h-5 rounded-full z-10"
      style={{ background: item.color, border: "3px solid #050510", boxShadow: `0 0 16px ${item.color}80` }}
    />
  );

  const content = (textAlign) => (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 px-6 md:px-8"
      style={{ textAlign }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: item.color, fontWeight: 700, letterSpacing: "0.1em" }}>
        {item.year}
      </span>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#F0F0F0", marginTop: "0.2rem" }}>
        {item.event}
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#808098", marginTop: "0.3rem", lineHeight: 1.55 }}>
        {item.desc}
      </p>
    </motion.div>
  );

  return (
    <div ref={ref} style={{ marginBottom: "2rem" }}>

      {/* ── Mobile: always left-aligned ── */}
      <div className="flex sm:hidden items-start gap-3 pl-2">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
            style={{ width: 14, height: 14, borderRadius: "50%", background: item.color,
              border: "2.5px solid #050510", flexShrink: 0, boxShadow: `0 0 12px ${item.color}80` }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1 }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: item.color, fontWeight: 700, letterSpacing: "0.1em" }}>
            {item.year}
          </span>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#F0F0F0", marginTop: "0.15rem" }}>
            {item.event}
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#808098", marginTop: "0.25rem", lineHeight: 1.55 }}>
            {item.desc}
          </p>
        </motion.div>
      </div>

      {/* ── Desktop: alternating left/right ── */}
      <div className={`hidden sm:flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {content(isLeft ? "right" : "left")}
        {dot}
        <div className="flex-1 px-6 md:px-8" />
      </div>

    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <div style={{ background: "#050510", minHeight: "100vh" }}>
      

      {/* ── Hero ── */}
      <motion.section ref={heroRef} className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "65vh", paddingTop: 100 }}>

        {/* Background text */}
        {["DATA", "SCIENCE", "INNOVATION"].map((word, i) => (
          <motion.span key={word}
            className="absolute font-black uppercase pointer-events-none select-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(5rem, 18vw, 16rem)",
              color: "rgba(26,111,232,0.04)",
              top: `${15 + i * 30}%`,
              left: i % 2 === 0 ? "-2%" : "auto",
              right: i % 2 !== 0 ? "-2%" : "auto",
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
              userSelect: "none",
            }}
            animate={{ x: i % 2 === 0 ? [0, 8, 0] : [0, -8, 0] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {word}
          </motion.span>
        ))}

        <motion.div style={{ y: heroY }} className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ color: "#1A6FE8", background: "rgba(26,111,232,0.08)", border: "1px solid rgba(26,111,232,0.22)", letterSpacing: "0.12em" }}>
              About SDS
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#F0F0F0", lineHeight: 1.05 }}>
            A community built<br />
            <span style={{ background: "linear-gradient(135deg, #4D91F0, #1A6FE8 40%, #F5A623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              by data obsessives.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "#606080", marginTop: "1rem", lineHeight: 1.7 }}>
            The Society for Data Science at BIT Mesra exists for one reason — to help students
            go from curious to capable in data science, ML, and AI.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            className="flex items-center justify-center gap-4 mt-8">
            <Link to="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
              style={{ background: "#1A6FE8", color: "#fff", boxShadow: "0 0 24px rgba(26,111,232,0.4)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
              Try AI Tools <ArrowRight size={14} />
            </Link>
            <Link to="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#808098", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
              Meet the team
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Pillars ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true, margin: "-60px" });
            const Icon = p.icon;
            return (
              <motion.div key={p.title} ref={ref}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-5"
                style={{ background: "#0D0D1A", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${p.color}15`, border: `1px solid ${p.color}28` }}>
                  <Icon size={20} style={{ color: p.color }} strokeWidth={1.7} />
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0F0F0" }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#808098", marginTop: "0.5rem", lineHeight: 1.6 }}>{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", letterSpacing: "0.12em" }}>
            Our journey
          </span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: "#F0F0F0" }}>
            How we got here
          </h2>
        </div>

        {/* Spine */}
        <div className="relative">
          {/* Desktop: center spine */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px"
            style={{ transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, rgba(26,111,232,0.3), rgba(245,166,35,0.3), transparent)" }} />
          {/* Mobile: left spine */}
          <div className="block sm:hidden absolute top-0 bottom-0 w-px"
            style={{ left: "0.6rem", background: "linear-gradient(to bottom, transparent, rgba(26,111,232,0.25), rgba(245,166,35,0.25), transparent)" }} />
          {TIMELINE.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
