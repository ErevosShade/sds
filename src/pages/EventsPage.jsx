import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin, X, Heart, RotateCcw, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const ALL_EVENTS = [
  {
    title: "DataHack 3.0",
    subtitle: "48-Hour Data Science Hackathon",
    date: "Aug 15–16, 2025",
    time: "9 AM onwards",
    type: "Hackathon",
    status: "upcoming",
    accent: "#F97316",
    emoji: "🚀",
    recap: "48-hour data science hackathon open to all BIT Mesra students. Build, analyze, win. Team up with 2-4 members and solve real-world data challenges.",
    stats: [{ label: "Duration", value: "48H" }, { label: "Open to", value: "All BIT" }, { label: "Format", value: "Teams" }],
    tags: ["Python", "ML", "Teams"],
  },
  {
    title: "ML Workshop Series",
    subtitle: "Supervised Learning to Deployment",
    date: "Sep 5, 2025",
    time: "2 PM – 6 PM",
    type: "Workshop",
    status: "upcoming",
    accent: "#10B981",
    emoji: "🧠",
    recap: "Hands-on deep dive into supervised learning, feature engineering, and model deployment using scikit-learn and FastAPI.",
    stats: [{ label: "Level", value: "Beginner" }, { label: "Mode", value: "Hands-on" }, { label: "Tools", value: "sklearn" }],
    tags: ["scikit-learn", "FastAPI", "Beginner"],
  },
  {
    title: "Industry Talk: Data @ Scale",
    subtitle: "Senior Data Engineer — Top Tech Co.",
    date: "Sep 20, 2025",
    time: "4 PM – 6 PM",
    type: "Talk",
    status: "upcoming",
    accent: "#3B82F6",
    emoji: "🎙️",
    recap: "Guest lecture from a senior data engineer covering real-world pipelines, distributed systems, and what it actually takes to work with data at scale.",
    stats: [{ label: "Format", value: "Talk" }, { label: "Level", value: "All" }, { label: "Mode", value: "Hybrid" }],
    tags: ["Career", "Systems", "Industry"],
  },
  {
    title: "Kaggle Sprint",
    subtitle: "Week-Long Team Competition",
    date: "Oct 3–10, 2025",
    time: "Self-paced",
    type: "Competition",
    status: "upcoming",
    accent: "#FB923C",
    emoji: "📊",
    recap: "Team-based Kaggle sprint with mentorship, weekly check-ins, and prizes for top submissions. Compete, learn, and get ranked.",
    stats: [{ label: "Duration", value: "7 Days" }, { label: "Platform", value: "Kaggle" }, { label: "Format", value: "Teams" }],
    tags: ["Kaggle", "Teams", "Prizes"],
  },
  {
    title: "Hack & Forge",
    subtitle: "DSS'26 Flagship Hackathon",
    date: "14–15 March 2025",
    time: "1 PM onwards",
    type: "Hackathon",
    status: "completed",
    accent: "#F97316",
    emoji: "⚡",
    recap: "24-hour hackathon powered by Unstop with prizes worth ₹20K. Teams built real solutions under pressure — from ideation to working demo in a single day.",
    stats: [{ label: "Duration", value: "24H" }, { label: "Prize Pool", value: "₹20K" }, { label: "Platform", value: "Unstop" }],
    tags: ["Unstop", "₹20K", "24H"],
  },
  {
    title: "DSS'26 Speaker Session",
    subtitle: "Siddhartha Samant — AI Lead, Deloitte",
    date: "15 March 2025",
    time: "11:00 AM – 1:00 PM",
    type: "Talk",
    status: "completed",
    accent: "#2563EB",
    emoji: "🎤",
    recap: "BIT Mesra alumni Siddhartha Samant shared insights on AI at enterprise scale, real-world deployment challenges, and career advice for aspiring AI engineers.",
    stats: [{ label: "Speaker", value: "1" }, { label: "Venue", value: "SH-3" }, { label: "Audience", value: "200+" }],
    tags: ["Deloitte", "AI", "Alumni"],
  },
  {
    title: "Coder's Cup",
    subtitle: "Competitive Coding Contest",
    date: "14 March 2025",
    time: "4 PM – 6 PM",
    type: "Competition",
    status: "completed",
    accent: "#FBBF24",
    emoji: "🏆",
    recap: "Competitive coding contest powered by Unstop. Sharp problems, sharper solutions — a 2-hour sprint to test algorithmic thinking under time pressure.",
    stats: [{ label: "Duration", value: "2H" }, { label: "Format", value: "Solo" }, { label: "Platform", value: "Unstop" }],
    tags: ["Algorithms", "Solo", "Unstop"],
  },
  {
    title: "Render Replicas",
    subtitle: "AI Image Rendering Challenge",
    date: "15 March 2025",
    time: "2 PM – 4 PM",
    type: "Workshop",
    status: "completed",
    accent: "#10B981",
    emoji: "🎨",
    recap: "Hands-on AI image-rendering challenge — participants replicated target renders using prompt engineering, blending technical precision with visual creativity.",
    stats: [{ label: "Date", value: "Mar 15" }, { label: "Time", value: "2–4 PM" }, { label: "Mode", value: "Hands-on" }],
    tags: ["GenAI", "Prompting", "Creative"],
  },
];

const TYPE_COLORS = {
  Hackathon:   { text: "#FB923C", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.25)" },
  Workshop:    { text: "#34D399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" },
  Talk:        { text: "#60A5FA", bg: "rgba(37,99,235,0.12)",   border: "rgba(37,99,235,0.25)"  },
  Competition: { text: "#FBBF24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.25)" },
};

// ─── Single Tinder Card ───────────────────────────────────────────────────────
function TinderCard({ event, onSwipe, isTop, offset }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity   = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity   = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 120) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  const tc = TYPE_COLORS[event.type] || TYPE_COLORS.Talk;

  return (
    <motion.div
      style={{
        x,
        rotate,
        position: "absolute",
        width: "100%",
        scale: isTop ? 1 : 1 - offset * 0.05,
        y: offset * 16,
        zIndex: 10 - offset,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 1 - offset * 0.05, y: offset * 16 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="cursor-grab active:cursor-grabbing select-none"
    >
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "#0D0D1A",
          border: `1px solid ${isTop ? event.accent + "40" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isTop
            ? `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${event.accent}15`
            : "0 4px 20px rgba(0,0,0,0.4)",
          minHeight: 480,
        }}
      >
        {/* LIKE overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl border-2 rotate-[-12deg]"
          aria-hidden
        >
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#22C55E", borderColor: "#22C55E" }}>
            INTERESTED ✓
          </span>
        </motion.div>

        {/* SKIP overlay */}
        <motion.div
          style={{ opacity: skipOpacity }}
          className="absolute top-6 right-6 z-20 px-4 py-2 rounded-xl border-2 rotate-[12deg]"
          aria-hidden
        >
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#EF4444", borderColor: "#EF4444" }}>
            SKIP ✕
          </span>
        </motion.div>

        {/* Card top visual area */}
        <div className="relative flex flex-col items-center justify-center py-10 gap-3"
          style={{ background: `linear-gradient(160deg, ${event.accent}10 0%, #080812 100%)`, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "4rem", lineHeight: 1 }}>{event.emoji}</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: tc.text, background: tc.bg, border: `1px solid ${tc.border}` }}>
            {event.type}
          </span>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
            style={event.status === "upcoming"
              ? { color: "#F5A623", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)" }
              : { color: "#606080", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }
            }>
            {event.status === "upcoming" ? "● Upcoming" : "Completed"}
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F0F0F0", lineHeight: 1.15 }}>
              {event.title}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: event.accent, marginTop: 2 }}>
              {event.subtitle}
            </p>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#808098", lineHeight: 1.6 }}>
            {event.recap}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#A0A0B8" }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {event.stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: event.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={12} style={{ color: "#606080" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#606080" }}>{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1.5">
                <Clock size={12} style={{ color: "#606080" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#606080" }}>{event.time}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [cards, setCards] = useState(ALL_EVENTS);
  const [swipedCards, setSwipedCards] = useState([]);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? cards
    : filter === "upcoming" ? cards.filter(c => c.status === "upcoming")
    : cards.filter(c => c.status === "completed");

  const handleSwipe = (dir) => {
    setLastSwipe(dir);
    const top = filtered[0];
    setSwipedCards(p => [...p, top]);
    setCards(c => c.filter(e => e.title !== top.title));
  };

  const handleUndo = () => {
    if (!swipedCards.length) return;
    const last = swipedCards[swipedCards.length - 1];
    setSwipedCards(p => p.slice(0, -1));
    setCards(c => [last, ...c]);
  };

  const reset = () => { setCards(ALL_EVENTS); setSwipedCards([]); };

  const visible = filtered.slice(0, 3);

  return (
    <div style={{ background: "#050510", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ paddingTop: 100 }}>

        {/* ── Page hero ── */}
        <div className="text-center" style={{ padding: "3rem 1.5rem 4rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", letterSpacing: "0.12em" }}>
              All Events
            </span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, color: "#F0F0F0", lineHeight: 1.08 }}>
              Swipe through our events
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#606080", marginTop: "0.75rem" }}>
              Drag right if you're interested · left to skip
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-6">
            {["all", "upcoming", "completed"].map(f => (
              <button key={f} onClick={() => { setFilter(f); reset(); }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200"
                style={filter === f
                  ? { background: "#1A6FE8", color: "#fff", boxShadow: "0 0 16px rgba(26,111,232,0.4)" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#606080" }
                }>
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Card stack ── */}
        <div className="flex flex-col items-center" style={{ padding: "0 1.5rem 5rem" }}>
          <div className="relative w-full" style={{ maxWidth: 420, height: 560 }}>
            <AnimatePresence>
              {visible.length > 0 ? (
                visible.map((event, i) => (
                  <TinderCard
                    key={event.title}
                    event={event}
                    isTop={i === 0}
                    offset={i}
                    onSwipe={handleSwipe}
                  />
                )).reverse()
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl"
                  style={{ background: "#0D0D1A", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{ fontSize: "3rem" }}>🎉</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#F0F0F0" }}>
                    You've seen them all!
                  </p>
                  <button onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                    style={{ background: "#1A6FE8", color: "#fff" }}>
                    <RotateCcw size={14} /> Start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5 mt-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe("left")}
              disabled={!visible.length}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", cursor: visible.length ? "pointer" : "not-allowed" }}>
              <X size={22} />
            </motion.button>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={handleUndo}
              disabled={!swipedCards.length}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#606080", cursor: swipedCards.length ? "pointer" : "not-allowed" }}>
              <RotateCcw size={15} />
            </motion.button>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe("right")}
              disabled={!visible.length}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", cursor: visible.length ? "pointer" : "not-allowed" }}>
              <Heart size={22} />
            </motion.button>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#3A3A5A", marginTop: "1rem" }}>
            {filtered.length - visible.length} swiped · {visible.length} remaining
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
