import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Code2, Briefcase, ArrowUpRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const TEAM = [
  { name: "Vaibhav Raj", role: "President", domain: "ML & Systems", img: null, gradient: "linear-gradient(135deg,#1A6FE8,#4D91F0)", initials: "VR", linkedin: "#", github: "#" },
  { name: "Himanshu Pravash", role: "Vice President", domain: "Data Engineering", img: null, gradient: "linear-gradient(135deg,#F5A623,#FFBE5C)", initials: "HP", linkedin: "#", github: "#" },
  { name: "Shanvi Vats", role: "Vice President", domain: "Research", img: null, gradient: "linear-gradient(135deg,#1258C0,#1A6FE8)", initials: "SV", linkedin: "#", github: "#" },
  { name: "Lakshay Mittal", role: "Director", domain: "Events & Outreach", img: null, gradient: "linear-gradient(135deg,#D4880A,#F5A623)", initials: "LM", linkedin: "#", github: "#" },
  { name: "Devashish Komiya", role: "Director", domain: "Technical", img: null, gradient: "linear-gradient(135deg,#1A6FE8,#1258C0)", initials: "DK", linkedin: "#", github: "#" },
  { name: "Vedant Pasari", role: "General Secretary", domain: "Operations", img: null, gradient: "linear-gradient(135deg,#F5A623,#D4880A)", initials: "VP", linkedin: "#", github: "#" },
  { name: "Aditi Kumari", role: "Joint Secretary", domain: "Coordination", img: null, gradient: "linear-gradient(135deg,#4D91F0,#1A6FE8)", initials: "AK", linkedin: "#", github: "#" },
];

const ROLES_ORDER = ["President", "Vice President", "Director", "General Secretary", "Joint Secretary"];

// ─── Floating word cloud in hero ──────────────────────────────────────────────
const FLOATING_WORDS = [
  { text: "Machine Learning", x: "8%", y: "18%", delay: 0, size: "0.8rem", color: "#1A6FE8", dur: 7 },
  { text: "Python", x: "72%", y: "12%", delay: 0.5, size: "0.75rem", color: "#F5A623", dur: 9 },
  { text: "Data Science", x: "82%", y: "40%", delay: 1, size: "0.85rem", color: "#4D91F0", dur: 6 },
  { text: "Research", x: "5%", y: "65%", delay: 1.5, size: "0.7rem", color: "#F5A623", dur: 8 },
  { text: "Deep Learning", x: "75%", y: "72%", delay: 0.8, size: "0.78rem", color: "#1A6FE8", dur: 10 },
  { text: "PyTorch", x: "12%", y: "82%", delay: 1.2, size: "0.72rem", color: "#4D91F0", dur: 7 },
  { text: "Hackathons", x: "55%", y: "85%", delay: 0.3, size: "0.76rem", color: "#F5A623", dur: 9 },
  { text: "NLP", x: "88%", y: "22%", delay: 1.8, size: "0.9rem", color: "#1A6FE8", dur: 6 },
];

function TeamCard({ member, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.93 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className="relative rounded-2xl p-6 flex flex-col items-center gap-4 text-center overflow-hidden transition-all duration-400"
        style={{
          background: "#0D0D1A",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(26,111,232,0.35)";
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(26,111,232,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.4)";
        }}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(26,111,232,0.08) 0%, transparent 70%)" }} />

        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black text-white transition-transform duration-300 group-hover:scale-110"
            style={{ background: member.gradient, boxShadow: "0 4px 24px rgba(0,0,0,0.4)", fontFamily: "'Syne', sans-serif" }}>
            {member.initials}
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: "#22C55E", borderColor: "#0D0D1A", boxShadow: "0 0 8px rgba(34,197,94,0.7)" }} />
        </div>

        {/* Info */}
        <div className="relative z-10">
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#F0F0F0" }}>
            {member.name}
          </h3>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold"
            style={{ color: "#1A6FE8", background: "rgba(26,111,232,0.10)", border: "1px solid rgba(26,111,232,0.22)" }}>
            {member.role}
          </span>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#606080", marginTop: "0.4rem" }}>
            {member.domain}
          </p>
        </div>

        {/* Social links — reveal on hover */}
        <div className="flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {[
            { Icon: Briefcase, href: member.linkedin, color: "#4D91F0", bg: "rgba(26,111,232,0.12)" },
            { Icon: Code2, href: member.github, color: "#A0A0B8", bg: "rgba(255,255,255,0.06)" },
            { Icon: ExternalLink, href: "#", color: "#F5A623", bg: "rgba(245,166,35,0.10)" },
          ].map(({ Icon, href, color, bg }) => (
            <a key={href + color} href={href} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: bg, border: `1px solid ${color}25`, color }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <Icon size={13} />
            </a>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: "linear-gradient(90deg, transparent, rgba(26,111,232,0.6), transparent)" }} />
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div style={{ background: "#050510", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <motion.section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "55vh", paddingTop: 100, paddingBottom: 60 }}
      >
        {/* Floating words */}
        {FLOATING_WORDS.map((w, i) => (
          <motion.span
            key={i}
            className="absolute font-semibold pointer-events-none hidden lg:block"
            style={{
              left: w.x, top: w.y, color: w.color, fontSize: w.size, opacity: 0.35,
              fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap"
            }}
            animate={{ y: [0, -10, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {w.text}
          </motion.span>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", letterSpacing: "0.12em" }}>
              Core Team
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#F0F0F0", lineHeight: 1.05 }}
          >
            The people
            <br />
            <span style={{ background: "linear-gradient(135deg, #4D91F0, #1A6FE8 40%, #F5A623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              behind SDS.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#606080", marginTop: "1rem", maxWidth: 400, margin: "1rem auto 0" }}
          >
            Students who organise, build, and keep the data science community alive at BIT Mesra.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ── Team grid ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
