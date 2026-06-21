import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin, ArrowUpRight, Zap } from "lucide-react";

import Footer from "../components/layout/Footer";

const EVENTS = [
  {
    title: "DataHack 3.0", subtitle: "48-Hour Data Science Hackathon",
    date: "Aug 15–16, 2025", time: "9 AM onwards", type: "Hackathon", status: "upcoming",
    accent: "#F97316", emoji: "🚀",
    recap: "48-hour data science hackathon open to all BIT Mesra students. Build, analyze, win.",
    stats: [{ label: "Duration", value: "48H" }, { label: "Open to", value: "All BIT" }, { label: "Format", value: "Teams" }],
    tags: ["Python", "ML", "Teams"], featured: true,
  },
  {
    title: "ML Workshop Series", subtitle: "Supervised Learning to Deployment",
    date: "Sep 5, 2025", time: "2 PM – 6 PM", type: "Workshop", status: "upcoming",
    accent: "#10B981", emoji: "🧠",
    recap: "Hands-on deep dive into supervised learning, feature engineering, and model deployment.",
    stats: [{ label: "Level", value: "Beginner" }, { label: "Mode", value: "Hands-on" }, { label: "Tools", value: "sklearn" }],
    tags: ["scikit-learn", "FastAPI", "Beginner"], featured: false,
  },
  {
    title: "Industry Talk: Data @ Scale", subtitle: "Senior Data Engineer — Top Tech Co.",
    date: "Sep 20, 2025", time: "4 PM – 6 PM", type: "Talk", status: "upcoming",
    accent: "#3B82F6", emoji: "🎙️",
    recap: "Guest lecture from a senior data engineer covering real-world pipelines and distributed systems.",
    stats: [{ label: "Format", value: "Talk" }, { label: "Level", value: "All" }, { label: "Mode", value: "Hybrid" }],
    tags: ["Career", "Systems", "Industry"], featured: false,
  },
  {
    title: "Kaggle Sprint", subtitle: "Week-Long Team Competition",
    date: "Oct 3–10, 2025", time: "Self-paced", type: "Competition", status: "upcoming",
    accent: "#FB923C", emoji: "📊",
    recap: "Team-based Kaggle sprint with mentorship, weekly check-ins, and prizes.",
    stats: [{ label: "Duration", value: "7 Days" }, { label: "Platform", value: "Kaggle" }, { label: "Format", value: "Teams" }],
    tags: ["Kaggle", "Teams", "Prizes"], featured: false,
  },
  {
    title: "Hack & Forge", subtitle: "DSS'26 Flagship Hackathon",
    date: "14–15 March 2025", time: "1 PM onwards", type: "Hackathon", status: "completed",
    accent: "#F97316", emoji: "⚡",
    recap: "24-hour hackathon powered by Unstop with prizes worth ₹20K. Teams built real solutions under pressure.",
    stats: [{ label: "Duration", value: "24H" }, { label: "Prize Pool", value: "₹20K" }, { label: "Platform", value: "Unstop" }],
    tags: ["Unstop", "₹20K", "24H"], featured: false,
  },
  {
    title: "DSS'26 Speaker Session", subtitle: "Siddhartha Samant — AI Lead, Deloitte",
    date: "15 March 2025", time: "11 AM – 1 PM", type: "Talk", status: "completed",
    accent: "#2563EB", emoji: "🎤",
    recap: "BIT Mesra alumni shared insights on AI at enterprise scale and career advice for aspiring AI engineers.",
    stats: [{ label: "Speaker", value: "1" }, { label: "Venue", value: "SH-3" }, { label: "Audience", value: "200+" }],
    tags: ["Deloitte", "AI", "Alumni"], featured: false,
  },
  {
    title: "Coder's Cup", subtitle: "Competitive Coding Contest",
    date: "14 March 2025", time: "4 PM – 6 PM", type: "Competition", status: "completed",
    accent: "#FBBF24", emoji: "🏆",
    recap: "Sharp problems, sharper solutions — a 2-hour sprint to test algorithmic thinking under pressure.",
    stats: [{ label: "Duration", value: "2H" }, { label: "Format", value: "Solo" }, { label: "Platform", value: "Unstop" }],
    tags: ["Algorithms", "Solo", "Unstop"], featured: false,
  },
  {
    title: "Render Replicas", subtitle: "AI Image Rendering Challenge",
    date: "15 March 2025", time: "2 PM – 4 PM", type: "Workshop", status: "completed",
    accent: "#10B981", emoji: "🎨",
    recap: "Prompt engineering challenge — replicate target renders using AI tools with precision and creativity.",
    stats: [{ label: "Date", value: "Mar 15" }, { label: "Time", value: "2–4 PM" }, { label: "Mode", value: "Hands-on" }],
    tags: ["GenAI", "Prompting", "Creative"], featured: false,
  },
];

const TYPE_COLORS = {
  Hackathon:   { text: "#FB923C", bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.22)" },
  Workshop:    { text: "#34D399", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.22)" },
  Talk:        { text: "#60A5FA", bg: "rgba(37,99,235,0.10)",  border: "rgba(37,99,235,0.22)"  },
  Competition: { text: "#FBBF24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.22)" },
};

function FeaturedCard({ event }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const tc = TYPE_COLORS[event.type];

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden group"
      style={{ background: "#0D0D1A", border: `1px solid ${event.accent}30`, boxShadow: `0 8px 48px rgba(0,0,0,0.5), 0 0 60px ${event.accent}10` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${event.accent}80, transparent)` }} />

      <div className="grid md:grid-cols-2 gap-0">
        {/* Left: visual */}
        <div className="relative flex flex-col items-center justify-center p-12 gap-4"
          style={{ background: `linear-gradient(135deg, ${event.accent}10 0%, #080810 100%)`, minHeight: 280 }}>
          <span style={{ fontSize: "5rem", lineHeight: 1 }}>{event.emoji}</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: `${event.accent}20`, color: event.accent, border: `1px solid ${event.accent}40`, letterSpacing: "0.1em" }}>
            Featured · Next Up
          </span>
          {/* Big ghost text */}
          <span aria-hidden style={{
            position: "absolute", fontFamily: "Syne, sans-serif", fontWeight: 900,
            fontSize: "clamp(4rem, 12vw, 8rem)", color: `${event.accent}06`, lineHeight: 1,
            letterSpacing: "-0.04em", userSelect: "none",
          }}>NEXT</span>
        </div>

        {/* Right: content */}
        <div className="p-8 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ color: tc.text, background: tc.bg, border: `1px solid ${tc.border}` }}>{event.type}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.28)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} />
              Upcoming
            </span>
          </div>

          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.25rem, 3.5vw, 1.8rem)", fontWeight: 900, color: "#F0F0F0", lineHeight: 1.1, marginBottom: "0.4rem" }}>
              {event.title}
            </h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", color: event.accent, marginBottom: "1rem" }}>{event.subtitle}</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", color: "#808098", lineHeight: 1.65 }}>{event.recap}</p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {event.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg text-xs"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#A0A0B8" }}>{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5">
              <CalendarDays size={13} style={{ color: "#606080" }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", color: "#606080" }}>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} style={{ color: "#606080" }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", color: "#606080" }}>{event.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            {event.stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: event.accent }}>{s.value}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.6rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const tc = TYPE_COLORS[event.type];

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <div className="relative h-full rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 overflow-hidden"
        style={{ background: "#0D0D1A", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.borderColor = `${event.accent}35`;
          e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${event.accent}12`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.35)";
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${event.accent}70, transparent)` }} />

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1.5rem" }}>{event.emoji}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ color: tc.text, background: tc.bg, border: `1px solid ${tc.border}` }}>{event.type}</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
            style={event.status === "upcoming"
              ? { color: "#F5A623", background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.28)" }
              : { color: "#606080", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
            {event.status === "upcoming" ? "Upcoming" : "Done"}
          </span>
        </div>

        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#F0F0F0", lineHeight: 1.2 }}>{event.title}</h3>
          {event.subtitle && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: event.accent, marginTop: 2 }}>{event.subtitle}</p>}
        </div>

        <p className="flex-1" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem", color: "#808098", lineHeight: 1.6 }}>{event.recap}</p>

        <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {event.stats.slice(0, 3).map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: event.accent }}>{s.value}</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.58rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={11} style={{ color: "#606080" }} />
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#606080" }}>{event.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const featured = EVENTS.find(e => e.featured);
  const rest = EVENTS.filter(e => !e.featured && (
    filter === "all" ? true : e.status === filter
  ));

  return (
    <div style={{ background: "#050510", minHeight: "100vh" }}>
      
      <main style={{ paddingTop: 100, paddingBottom: "5rem" }}>

        {/* Page header */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", letterSpacing: "0.12em" }}>
              <Zap size={11} strokeWidth={2.5} /> All Events
            </span>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#F0F0F0", lineHeight: 1.05 }}>
                What we've<br />been building
              </h1>
              {/* Filter tabs */}
              <div className="flex items-center gap-2">
                {["all", "upcoming", "completed"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200"
                    style={filter === f
                      ? { background: "#1A6FE8", color: "#fff", boxShadow: "0 0 16px rgba(26,111,232,0.4)" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#606080" }
                    }>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

          {/* Featured event */}
          {featured && (filter === "all" || filter === "upcoming") && (
            <div className="mb-8">
              <FeaturedCard event={featured} />
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {rest.map((event, i) => (
                <EventCard key={event.title} event={event} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}